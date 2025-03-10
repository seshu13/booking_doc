import { NextResponse } from 'next/server';

const doctors = [
  {
    id: 'dr-sameer',
    name: 'Dr. Sameer',
    fee: 700,
    speciality: 'Orthopedic Surgeon',
    experience: '15+ years',
    rating: 4.9,
    location: 'HSR Layout, Bangalore',
    availability: 'Available Today',
    qualifications: ['MBBS', 'MS Ortho', 'Fellowship in Sports Medicine'],
    image: '/doctors/dr-sameer.jpg'
  },
  {
    id: 'other-doctors',
    name: 'Other Doctors',
    fee: 1000,
    speciality: 'Sports Orthopedic Doctors',
    experience: '10+ years',
    rating: 4.7,
    location: 'HSR Layout, Bangalore',
    availability: 'Available Today',
    qualifications: ['MBBS', 'MS Ortho'],
    image: '/doctors/default-doctor.jpg'
  }
];

export async function GET() {
  return NextResponse.json(doctors);
} 