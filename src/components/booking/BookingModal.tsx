'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import DoctorSelection from './DoctorSelectionNew';
import DateTimeSelection from './DateTimeSelection';
import PatientDetails from './PatientDetails';
import Summary from './Summary';
import ThankYou from './ThankYou';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  { id: 'doctor', title: 'Choose Doctor' },
  { id: 'datetime', title: 'Select Time' },
  { id: 'details', title: 'Your Details' },
  { id: 'confirm', title: 'Confirm' },
  { id: 'success', title: 'Success' }
];

interface BookingData {
  doctor: string;
  date: Date | null;
  time: string;
  name: string;
  phone: string;
  email: string;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>({
    doctor: '',
    date: null,
    time: '',
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: bookingData.doctor,
          patientName: bookingData.name,
          phone: bookingData.phone,
          email: bookingData.email,
          date: bookingData.date?.toISOString(),
          time: bookingData.time,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }

      setCurrentStep(4); // Move to success step
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Close Button */}
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={onClose}
                className="bg-gray-50 hover:bg-gray-100 w-8 h-8 inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <X className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 pt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 0 && (
                    <DoctorSelection
                      selected={bookingData.doctor}
                      onSelect={(doctorId) => {
                        updateBookingData({ doctor: doctorId });
                        handleNext();
                      }}
                    />
                  )}
                  {currentStep === 1 && (
                    <DateTimeSelection
                      selected={{ date: bookingData.date, time: bookingData.time }}
                      onSelect={(dateTime) => {
                        updateBookingData(dateTime);
                        handleNext();
                      }}
                      onBack={handleBack}
                    />
                  )}
                  {currentStep === 2 && (
                    <PatientDetails
                      data={{
                        name: bookingData.name,
                        phone: bookingData.phone,
                        email: bookingData.email
                      }}
                      onSubmit={(details) => {
                        updateBookingData(details);
                        handleNext();
                      }}
                      onBack={handleBack}
                    />
                  )}
                  {currentStep === 3 && (
                    <Summary
                      bookingData={{
                        doctor: bookingData.doctor,
                        date: bookingData.date,
                        time: bookingData.time,
                        patientName: bookingData.name,
                        phone: bookingData.phone,
                        email: bookingData.email
                      }}
                      onConfirm={handleConfirm}
                      onBack={handleBack}
                      isSubmitting={isSubmitting}
                    />
                  )}
                  {currentStep === 4 && (
                    <ThankYou
                      bookingData={{
                        doctor: bookingData.doctor,
                        date: bookingData.date,
                        time: bookingData.time
                      }}
                      onClose={onClose}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress Bar and Steps */}
            <div className="mt-6 border-t border-gray-100">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`
                        text-sm font-medium transition-colors
                        ${index === currentStep 
                          ? 'text-[#8B5C9E]' 
                          : index < currentStep 
                            ? 'text-[#8B5C9E]/60'
                            : 'text-gray-400'
                        }
                      `}
                    >
                      {step.title}
                    </div>
                  ))}
                </div>
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-[#8B5C9E] to-[#6B4A7E]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
