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

    const [doctors, patients, prescriptions, byStatus, byDay, topDoctors] = await Promise.all([
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
      topDoctors: topDoctors.map(d => ({
        doctorId: d.authorId,
        count: d._count.authorId,
      })),
    };
  }
}