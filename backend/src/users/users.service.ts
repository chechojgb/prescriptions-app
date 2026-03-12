import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; name: string; password: string; role: 'patient' | 'doctor'; specialty?: string }) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
          role: data.role,
        },
      });

      if (data.role === 'doctor') {
        await tx.doctor.create({
          data: {
            userId: user.id,
            specialty: data.specialty || 'General Medicine',
          },
        });
      } else if (data.role === 'patient') {
        await tx.patient.create({
          data: {
            userId: user.id,
          },
        });
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    });
  }

  async update(id: string, data: { email?: string; name?: string }) {
    if (data.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: { 
          email: data.email,
          NOT: { id } 
        }
      });
      if (existingUser) throw new ConflictException('Email already in use by another account');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    return updatedUser;
  }
  async updatePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new UnauthorizedException('Contraseña actual incorrecta');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async findAll(role?: string, query?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const users = await this.prisma.user.findMany({
      where: {
        ...(role && { role: role as any }),
        ...(query && {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.user.count({
      where: {
        ...(role && { role: role as any }),
        ...(query && {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        }),
      },
    });

    return { data: users, total, page, limit };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async searchPatients(query?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const patients = await this.prisma.patient.findMany({
      where: query ? {
        user: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
      } : {},
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      skip,
      take: limit,
    });

    const total = await this.prisma.patient.count();
    return { data: patients, total, page, limit };
  }
}