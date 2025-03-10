'use client';

import { useEffect, useState } from 'react';
import { Star, Clock, Award, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import DoctorImage from './DoctorImage';

interface Doctor {
  id: string;
  name: string;
  fee: number;
  speciality: string;
  image?: string;
  experience?: string;
  rating?: number;
  location?: string;
  availability?: string;
  qualifications?: string[];
}

interface DoctorSelectionProps {
  selected: string;
  onSelect: (doctorId: string) => void;
}

const DoctorCard = motion.button;

const DoctorSelection = ({ selected, onSelect }: DoctorSelectionProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError('Failed to load doctors. Please try again later.');
        console.error('Error fetching doctors:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-[#8B5C9E] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Loading doctors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-[#8B5C9E] hover:text-[#6B4A7E] font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 px-1">
        Choose Your Doctor
      </h2>
      <div className="space-y-4 md:space-y-6">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            onClick={() => onSelect(doctor.id)}
            whileHover={{ scale: isMobile ? 1 : 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full text-left transition-all duration-200
              ${selected === doctor.id
                ? 'bg-gradient-to-br from-[#8B5C9E] to-[#6B4A7E] text-white shadow-lg'
                : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#8B5C9E]/30'
              }
              p-4 md:p-6 rounded-xl md:rounded-2xl
            `}
          >
            <div className="flex gap-4 md:gap-6">
              {/* Doctor Image */}
              <div className="relative w-20 h-28 md:w-24 md:h-32 flex-shrink-0">
                <DoctorImage
                  src={doctor.image}
                  alt={doctor.name}
                />
              </div>

              {/* Doctor Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-0 mb-3">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-1 text-gray-900">
                      {doctor.name}
                    </h3>
                    <p className={`
                      text-sm font-medium
                      ${selected === doctor.id ? 'text-white' : 'text-[#8B5C9E] font-semibold'}
                    `}>
                      {doctor.speciality}
                    </p>
                  </div>
                  <div className="md:text-right">
                    <p className={`
                      text-xl md:text-2xl font-bold
                      ${selected === doctor.id ? 'text-white' : 'text-gray-900'}
                    `}>
                      ₹{doctor.fee}
                    </p>
                    <p className={`
                      text-xs font-medium mt-0.5 md:mt-1
                      ${selected === doctor.id ? 'text-white/90' : 'text-gray-700'}
                    `}>
                      Per Consultation
                    </p>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                  {doctor.qualifications?.map((qual, index) => (
                    <span
                      key={index}
                      className={`
                        text-xs font-semibold px-2 py-0.5 md:px-2.5 md:py-1 rounded-full
                        ${selected === doctor.id
                          ? 'bg-white/20 text-white'
                          : 'bg-[#8B5C9E]/10 text-[#8B5C9E]'}
                      `}
                    >
                      {qual}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`
                      p-1.5 md:p-2 rounded-lg
                      ${selected === doctor.id ? 'bg-white/20' : 'bg-[#8B5C9E]/10'}
                    `}>
                      <Star className={`w-3.5 h-3.5 md:w-4 md:h-4 ${selected === doctor.id ? 'text-white' : 'text-[#8B5C9E]'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${selected === doctor.id ? 'text-white' : 'text-gray-900'}`}>
                        {doctor.rating}
                      </p>
                      <p className={`text-[10px] md:text-xs font-medium ${selected === doctor.id ? 'text-white/90' : 'text-gray-700'}`}>
                        Rating
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`
                      p-1.5 md:p-2 rounded-lg
                      ${selected === doctor.id ? 'bg-white/20' : 'bg-[#8B5C9E]/10'}
                    `}>
                      <Award className={`w-3.5 h-3.5 md:w-4 md:h-4 ${selected === doctor.id ? 'text-white' : 'text-[#8B5C9E]'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${selected === doctor.id ? 'text-white' : 'text-gray-900'}`}>
                        {doctor.experience}
                      </p>
                      <p className={`text-[10px] md:text-xs font-medium ${selected === doctor.id ? 'text-white/90' : 'text-gray-700'}`}>
                        Experience
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`
                      p-1.5 md:p-2 rounded-lg
                      ${selected === doctor.id ? 'bg-white/20' : 'bg-[#8B5C9E]/10'}
                    `}>
                      <Clock className={`w-3.5 h-3.5 md:w-4 md:h-4 ${selected === doctor.id ? 'text-white' : 'text-[#8B5C9E]'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${selected === doctor.id ? 'text-white' : 'text-gray-900'}`}>
                        Available
                      </p>
                      <p className={`text-[10px] md:text-xs font-medium ${selected === doctor.id ? 'text-white/90' : 'text-gray-700'}`}>
                        Today
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`
                      p-1.5 md:p-2 rounded-lg
                      ${selected === doctor.id ? 'bg-white/20' : 'bg-[#8B5C9E]/10'}
                    `}>
                      <MapPin className={`w-3.5 h-3.5 md:w-4 md:h-4 ${selected === doctor.id ? 'text-white' : 'text-[#8B5C9E]'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${selected === doctor.id ? 'text-white' : 'text-gray-900'}`}>
                        HSR Layout
                      </p>
                      <p className={`text-[10px] md:text-xs font-medium ${selected === doctor.id ? 'text-white/90' : 'text-gray-700'}`}>
                        Location
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DoctorCard>
        ))}
      </div>
    </div>
  );
};

export default DoctorSelection; 