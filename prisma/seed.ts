const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.appointment.deleteMany();
  await prisma.doctor.deleteMany();

  // Create doctors
  const doctors = [
    {
      id: 'dr-sameer',
      name: 'Dr. Sameer',
      fee: 700,
      speciality: 'Orthopedic Surgeon',
    },
    {
      id: 'other-doctors',
      name: 'Other Doctors',
      fee: 1000,
      speciality: 'Sports Orthopedic Doctors',
    }
  ] as const;

  for (const doctor of doctors) {
    await prisma.doctor.create({
      data: doctor
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 