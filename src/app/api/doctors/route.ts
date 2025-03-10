import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Doctor } from '@prisma/client';

interface EnhancedDoctor extends Omit<Doctor, 'createdAt' | 'updatedAt'> {
  experience: string;
  rating: number;
  location: string;
  availability: string;
  qualifications: string[];
  image: string;
}

export async function GET() {
  try {
    const dbDoctors = await prisma.doctor.findMany();
    
    const doctors: EnhancedDoctor[] = dbDoctors.map((doctor: Doctor) => ({
      id: doctor.id,
      name: doctor.name,
      fee: doctor.fee,
      speciality: doctor.speciality,
      experience: doctor.id === 'dr-sameer' ? '15+ years' : '10+ years',
      rating: doctor.id === 'dr-sameer' ? 4.9 : 4.7,
      location: 'HSR Layout, Bangalore',
      availability: 'Available Today',
      qualifications: doctor.id === 'dr-sameer' 
        ? ['MBBS', 'MS Ortho', 'Fellowship in Sports Medicine']
        : ['MBBS', 'MS Ortho'],
      image: `data:image/svg+xml,${encodeURIComponent('<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="600" fill="#8B5C9E"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="24">' + doctor.name + '</text></svg>')}`
    }));

    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
} 