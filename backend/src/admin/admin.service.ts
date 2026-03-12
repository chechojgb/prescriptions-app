import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getMetrics(from?: string, to?: string) {
    const dateFilter = from || to ? {
      createdAt: {
        ...(from && { gte: new Date(from) }),
        ...(to && { lte: new Date(to) }),
      },
    } : {};

    const [doctors, patients, prescriptions, byStatus, byDay, topDoctorsRaw] = await Promise.all([
      this.prisma.doctor.count(),
      this.prisma.patient.count(),
      this.prisma.prescription.count({ where: dateFilter }),
      this.prisma.prescription.groupBy({
        by: ['status'],
        _count: { status: true },
        where: dateFilter,
      }),
      this.prisma.prescription.groupBy({
        by: ['createdAt'],
        _count: { createdAt: true },
        where: dateFilter,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.prescription.groupBy({
        by: ['authorId'],
        _count: { authorId: true },
        orderBy: { _count: { authorId: 'desc' } },
        take: 5,
      }),
    ]);

    // Buscamos los nombres de los médicos
    const doctorIds = topDoctorsRaw.map(d => d.authorId);
    const doctorProfiles = await this.prisma.doctor.findMany({
      where: { id: { in: doctorIds } },
      include: { user: { select: { name: true } } },
    });

    const doctorMap = doctorProfiles.reduce((acc, d) => {
      acc[d.id] = d.user.name;
      return acc;
    }, {} as Record<string, string>);

    return {
      totals: { doctors, patients, prescriptions },
      byStatus: byStatus.reduce((acc, curr) => {
        acc[curr.status] = curr._count.status;
        return acc;
      }, {} as Record<string, number>),
      byDay: byDay.map(d => ({
        date: d.createdAt.toISOString().split('T')[0],
        count: d._count.createdAt,
      })),
      topDoctors: topDoctorsRaw.map(d => ({
        doctorId: d.authorId,
        doctorName: doctorMap[d.authorId] || 'Desconocido',
        count: d._count.authorId,
      })),
    };
  }
}