'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

const patientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^[0-9+\-\s()]*$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email address'),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientDetailsProps {
  data: {
    name: string;
    phone: string;
    email: string;
  };
  onSubmit: (data: PatientFormData) => void;
  onBack: () => void;
}

const PatientDetails = ({ data, onSubmit, onBack }: PatientDetailsProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: data,
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <button
          onClick={onBack}
          className="text-sm text-[#8B5C9E] hover:text-[#6B4A7E] font-medium flex items-center gap-1
                   active:scale-95 transition-transform touch-manipulation"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="space-y-1 md:space-y-2 md:text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Patient Details</h2>
        <p className="text-sm md:text-base font-medium text-gray-600">
          Please provide your contact information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
        <div className="space-y-4 md:space-y-5">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              autoComplete="name"
              {...register('name')}
              className={`
                w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border bg-white text-gray-900 
                placeholder:text-gray-500 text-base md:text-base
                focus:outline-none focus:ring-2 focus:ring-[#8B5C9E] focus:border-transparent
                ${errors.name ? 'border-red-300 ring-red-50' : 'border-gray-200'}
                touch-manipulation
              `}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-sm font-medium text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-900">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              autoComplete="tel"
              inputMode="numeric"
              {...register('phone')}
              className={`
                w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border bg-white text-gray-900 
                placeholder:text-gray-500 text-base md:text-base
                focus:outline-none focus:ring-2 focus:ring-[#8B5C9E] focus:border-transparent
                ${errors.phone ? 'border-red-300 ring-red-50' : 'border-gray-200'}
                touch-manipulation
              `}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-sm font-medium text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              inputMode="email"
              {...register('email')}
              className={`
                w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border bg-white text-gray-900 
                placeholder:text-gray-500 text-base md:text-base
                focus:outline-none focus:ring-2 focus:ring-[#8B5C9E] focus:border-transparent
                ${errors.email ? 'border-red-300 ring-red-50' : 'border-gray-200'}
                touch-manipulation
              `}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-sm font-medium text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full px-6 py-3 rounded-lg bg-[#8B5C9E] text-white font-medium text-base
            hover:bg-[#7B4C8E] transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            touch-manipulation
          `}
        >
          {isSubmitting ? 'Submitting...' : 'Continue'}
        </motion.button>
      </form>
    </div>
  );
};

export default PatientDetails;
