import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.appointment.deleteMany();
  await prisma.doctor.deleteMany();

  // Create doctors
  const drSameer = await prisma.doctor.create({
    data: {
      name: 'Dr. Sameer',
      fee: 700,
      speciality: 'Orthopedic Surgeon',
    },
  });

  const otherDoctors = await prisma.doctor.create({
    data: {
      name: 'Other Doctors',
      fee: 1000,
      speciality: 'Sports Orthopedic Doctors',
    },
  });

  console.log({ drSameer, otherDoctors });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 