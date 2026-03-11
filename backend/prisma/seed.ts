import 'dotenv/config';
import { PrismaClient } from '../src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const doctorPassword = await bcrypt.hash('dr123', 10);
  const patientPassword = await bcrypt.hash('patient123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: adminPassword,
      name: 'Admin',
      role: 'admin',
    },
  });

  const doctor = await prisma.user.upsert({
    where: { email: 'dr@test.com' },
    update: {},
    create: {
      email: 'dr@test.com',
      password: doctorPassword,
      name: 'Doctor Test',
      role: 'doctor',
      doctor: { create: { specialty: 'General' } },
    },
  });

  const patient = await prisma.user.upsert({
    where: { email: 'patient@test.com' },
    update: {},
    create: {
      email: 'patient@test.com',
      password: patientPassword,
      name: 'Patient Test',
      role: 'patient',
      patient: { create: {} },
    },
  });

  const doctorProfile = await prisma.doctor.findUnique({ where: { userId: doctor.id } });
  const patientProfile = await prisma.patient.findUnique({ where: { userId: patient.id } });

  const prescriptions = [
    { notes: 'Tratamiento gripe', status: 'pending', items: [{ name: 'Ibuprofeno 400mg', dosage: '1 cada 8h', quantity: 12, instructions: 'Con comida' }] },
    { notes: 'Infección bacteriana', status: 'consumed', items: [{ name: 'Amoxicilina 500mg', dosage: '1 cada 8h', quantity: 15, instructions: 'Después de comer' }] },
    { notes: 'Dolor de cabeza', status: 'pending', items: [{ name: 'Paracetamol 1g', dosage: '1 cada 6h', quantity: 20, instructions: 'Con agua' }] },
    { notes: 'Alergia', status: 'consumed', items: [{ name: 'Loratadina 10mg', dosage: '1 diaria', quantity: 10, instructions: 'En la mañana' }] },
    { notes: 'Hipertensión', status: 'pending', items: [{ name: 'Enalapril 10mg', dosage: '1 diaria', quantity: 30, instructions: 'En ayunas' }] },
  ];

  for (const p of prescriptions) {
    await prisma.prescription.create({
      data: {
        code: `RX-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        notes: p.notes,
        status: p.status as any,
        patientId: patientProfile!.id,
        authorId: doctorProfile!.id,
        consumedAt: p.status === 'consumed' ? new Date() : null,
        items: { create: p.items },
      },
    });
  }
  
  console.log({ admin, doctor, patient });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());