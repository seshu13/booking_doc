'use client';

import { useState, useEffect } from 'react';
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
  { id: 'doctor', title: 'Doctor' },
  { id: 'datetime', title: 'Time' },
  { id: 'details', title: 'Details' },
  { id: 'confirm', title: 'Review' },
  { id: 'success', title: 'Done' }
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
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
            animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
            exit={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:w-[90vw] md:max-w-2xl 
                     bg-white overflow-hidden md:rounded-2xl md:shadow-xl
                     flex flex-col"
          >
            {/* Close Button */}
            <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
              <button
                onClick={onClose}
                className="bg-gray-50 hover:bg-gray-100 w-10 h-10 md:w-8 md:h-8 
                         inline-flex items-center justify-center rounded-full 
                         transition-all duration-200 focus:outline-none 
                         focus:ring-2 focus:ring-gray-200
                         active:scale-95"
              >
                <X className="w-5 h-5 md:w-4 md:h-4 text-gray-600" strokeWidth={2.5} />
              </button>
            </div>

            {/* Progress Bar and Steps */}
            <div className="relative z-10 px-4 pt-4 pb-2 md:px-6 md:pt-6 md:pb-4 bg-white border-b border-gray-100">
              <div className="flex items-center justify-between mb-2 overflow-x-auto hide-scrollbar">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`
                      text-xs md:text-sm font-medium whitespace-nowrap px-2 flex-shrink-0
                      transition-colors
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 md:px-8 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
