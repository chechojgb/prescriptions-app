import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import { Response } from 'express';
import * as QRCode from 'qrcode';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(authorUserId: string, patientId: string, notes: string, items: any[]) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId: authorUserId } });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const patient = await this.prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) throw new NotFoundException('Medical patient not found');

    const code = `RX-${Date.now()}`;

    return this.prisma.prescription.create({
      data: {
        code,
        notes,
        patientId,
        authorId: doctor.id,
        items: {
          create: items.map(item => ({
            name: item.name,
            dosage: item.dosage,
            quantity: item.quantity,
            instructions: item.instructions,
          })),
        },
      },
      include: { items: true },
    });
  }

  async findAll(filters: {
    userId: string;
    role: string;
    status?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
    order?: string;
    doctorId?: string;
    patientId?: string;
  }) {
    const { userId, role, status, from, to, page = 1, limit = 10, order = 'desc', doctorId, patientId } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(status && { status }),
      ...(from || to ? { createdAt: { ...(from && { gte: new Date(from) }), ...(to && { lte: new Date(to) }) } } : {}),
    };

    if (role === 'doctor') {
      const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
      if (!doctor) throw new NotFoundException('Doctor not found');
      where.authorId = doctor.id;
    }

    if (role === 'patient') {
      const patient = await this.prisma.patient.findUnique({ where: { userId } });
      if (!patient) throw new NotFoundException('Medical patient not found');
      where.patientId = patient.id;
    }

    if (role === 'admin') {
      if (doctorId) where.authorId = doctorId;
      if (patientId) where.patientId = patientId;
    }

    const [data, total] = await Promise.all([
      this.prisma.prescription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: order === 'asc' ? 'asc' : 'desc' },
        include: {
          items: true,
          patient: { include: { user: { select: { name: true, email: true } } } },
          author: { include: { user: { select: { name: true, email: true } } } },
        },
      }),
      this.prisma.prescription.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string, userId: string, role: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        items: true,
        patient: { include: { user: { select: { name: true, email: true } } } },
        author: { include: { user: { select: { name: true, email: true } } } },
      },
    });

    if (!prescription) throw new NotFoundException('Prescription not found');

    if (role === 'doctor') {
      const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
      if (prescription.authorId !== doctor?.id) throw new ForbiddenException();
    }

    if (role === 'patient') {
      const patient = await this.prisma.patient.findUnique({ where: { userId } });
      if (prescription.patientId !== patient?.id) throw new ForbiddenException();
    }

    return prescription;
  }

  async consume(id: string, userId: string) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException('Medical patient not found');

    const prescription = await this.prisma.prescription.findUnique({ where: { id } });
    if (!prescription) throw new NotFoundException('prescription not found');
    if (prescription.patientId !== patient.id) throw new ForbiddenException();

    return this.prisma.prescription.update({
      where: { id },
      data: { status: 'consumed', consumedAt: new Date() },
    });
  }

  async generatePdf(id: string, userId: string, role: string, res: Response) {
    const prescription = await this.findOne(id, userId, role);

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=prescription-${prescription.code}.pdf`);

    doc.pipe(res);

    doc.fontSize(22).text('MEDICAL PRESCRIPTION', { align: 'center', stroke: true });
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();

    doc.fontSize(10).font('Helvetica-Bold').text(`CODE: ${prescription.code}`);
    doc.font('Helvetica').text(`Date: ${prescription.createdAt.toLocaleDateString()}`);
    doc.text(`Status: ${prescription.status.toUpperCase()}`);
    doc.moveDown();

    const currentY = doc.y;
    doc.font('Helvetica-Bold').text('DOCTOR:', 50, currentY);
    doc.font('Helvetica').text(`${prescription.author.user.name}`, 50, currentY + 15);
    doc.text(`Specialty: ${prescription.author.specialty || 'General Practitioner'}`, 50, currentY + 30);

    doc.font('Helvetica-Bold').text('PATIENT:', 300, currentY);
    doc.font('Helvetica').text(`${prescription.patient.user.name}`, 300, currentY + 15);
    doc.text(`Email: ${prescription.patient.user.email}`, 300, currentY + 30);

    doc.moveDown(4);

    doc.fontSize(14).font('Helvetica-Bold').text('PRESCRIPTION ITEMS', { underline: true });
    doc.moveDown(0.5);

    prescription.items.forEach((item, index) => {
      doc.fontSize(11).font('Helvetica-Bold').text(`${index + 1}. ${item.name}`);
      doc.font('Helvetica').fontSize(10);
      if (item.dosage) doc.text(`   Dose: ${item.dosage}`);
      if (item.quantity) doc.text(`   Quantity: ${item.quantity}`);
      if (item.instructions) doc.text(`   Instructions: ${item.instructions}`);
      doc.moveDown(0.5);

      if (doc.y > 700) doc.addPage();
    });

    if (prescription.notes) {
      doc.moveDown();
      doc.font('Helvetica-Oblique').fontSize(10).text(`Notes: ${prescription.notes}`);
    }

    const qrDataUrl = await QRCode.toDataURL(prescription.code);
    const footerY = 650;

    doc.image(qrDataUrl, 50, footerY, { width: 80 });
    doc.fontSize(8).font('Helvetica').text('Scan to verify prescription', 50, footerY + 85);

    doc.moveTo(350, footerY + 60).lineTo(520, footerY + 60).stroke();
    doc.fontSize(10).font('Helvetica-Bold').text('Doctor Signature', 350, footerY + 65, { width: 170, align: 'center' });
    doc.fontSize(8).font('Helvetica').text(`ID Ref: ${prescription.authorId}`, 350, footerY + 78, { width: 170, align: 'center' });

    doc.end();
  }
}