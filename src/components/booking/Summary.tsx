'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Clock, User, Phone, Mail, Check, Loader2, ChevronLeft } from 'lucide-react';

interface SummaryProps {
  bookingData: {
    doctor: string;
    date: Date | null;
    time: string;
    patientName: string;
    phone: string;
    email: string;
  };
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const Summary = ({ bookingData, onConfirm, onBack, isSubmitting }: SummaryProps) => {
  const doctorFee = bookingData.doctor === 'dr-sameer' ? 700 : 1000;
  const doctorName = bookingData.doctor === 'dr-sameer' ? 'Dr. Sameer' : 'Other Doctor';

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="text-sm text-[#8B5C9E] hover:text-[#6B4A7E] font-medium flex items-center gap-1
                   active:scale-95 transition-transform touch-manipulation
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="space-y-1 md:space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Booking Summary</h2>
        <p className="text-sm md:text-base font-medium text-gray-600">
          Review your appointment details
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 md:p-6 space-y-4 max-h-[calc(100vh-20rem)] overflow-y-auto">
        {/* Doctor Info */}
        <div className="flex items-start space-x-3">
          <User className="w-5 h-5 text-[#8B5C9E] mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-600">Doctor</p>
            <p className="font-semibold text-gray-900 break-words">{doctorName}</p>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-[#8B5C9E] mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-600">Date</p>
            <p className="font-semibold text-gray-900 break-words">
              {bookingData.date ? format(bookingData.date, 'EEEE, MMMM d, yyyy') : ''}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Clock className="w-5 h-5 text-[#8B5C9E] mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-600">Time</p>
            <p className="font-semibold text-gray-900">{bookingData.time}</p>
          </div>
        </div>

        {/* Patient Info */}
        <div className="flex items-start space-x-3">
          <User className="w-5 h-5 text-[#8B5C9E] mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-600">Patient Name</p>
            <p className="font-semibold text-gray-900 break-words">{bookingData.patientName}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Phone className="w-5 h-5 text-[#8B5C9E] mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-600">Phone</p>
            <p className="font-semibold text-gray-900 break-words">{bookingData.phone}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Mail className="w-5 h-5 text-[#8B5C9E] mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-600">Email</p>
            <p className="font-semibold text-gray-900 break-words">{bookingData.email}</p>
          </div>
        </div>

        {/* Fee */}
        <div className="mt-4 md:mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Consultation Fee</span>
            <span className="text-lg font-semibold text-[#8B5C9E]">₹{doctorFee}</span>
          </div>
          <p className="text-xs md:text-sm font-medium text-gray-600 mt-1">
            Payment to be made at the clinic
          </p>
        </div>
      </div>

      {/* Actions */}
      <motion.button
        onClick={onConfirm}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg 
                 bg-[#8B5C9E] text-white font-medium text-base
                 hover:bg-[#7B4C8E] transition-colors 
                 disabled:opacity-50 disabled:cursor-not-allowed
                 touch-manipulation"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Confirming...</span>
          </>
        ) : (
          <>
            <Check className="w-5 h-5" />
            <span>Confirm Booking</span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default Summary;
