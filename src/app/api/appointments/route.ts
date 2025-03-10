import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Appointment, Doctor } from '@prisma/client';

const appointmentSchema = z.object({
  doctorId: z.string(),
  patientName: z.string().min(2),
  phone: z.string().min(10).max(15),
  email: z.string().email(),
  date: z.string().transform((str) => new Date(str)),
  time: z.string(),
});

interface WebhookData {
  appointment: Appointment & {
    doctor: Doctor;
  };
  meta: {
    source: string;
    environment: string | undefined;
  };
}

async function sendWebhook(data: WebhookData) {
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('Webhook URL not configured');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'appointment_created',
        timestamp: new Date().toISOString(),
        data
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}`);
    }

    console.log('Webhook sent successfully');
  } catch (error) {
    console.error('Failed to send webhook:', error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the input
    const validatedData = appointmentSchema.parse(body);

    // Save to database using Prisma
    const appointment = await prisma.appointment.create({
      data: {
        doctorId: validatedData.doctorId,
        patientName: validatedData.patientName,
        phone: validatedData.phone,
        email: validatedData.email,
        date: validatedData.date,
        time: validatedData.time,
        status: 'confirmed'
      },
      include: {
        doctor: true
      }
    });

    // Send webhook with appointment details
    await sendWebhook({
      appointment,
      meta: {
        source: 'booking_widget',
        environment: process.env.NODE_ENV
      }
    });

    return NextResponse.json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        doctor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
} 