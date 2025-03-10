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
    <div className="space-y-4">
      <h2 className="text-lg md:text-xl font-semibold text-gray-900">
        Choose Your Doctor
      </h2>
      <div className="space-y-3">
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
              p-3 md:p-4 rounded-xl
            `}
          >
            <div className="flex gap-3 md:gap-4">
              {/* Doctor Image */}
              <div className="relative w-16 h-24 md:w-20 md:h-28 flex-shrink-0">
                <DoctorImage
                  src={doctor.image}
                  alt={doctor.name}
                />
              </div>

              {/* Doctor Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 md:gap-0 mb-2">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold mb-0.5 text-gray-900">
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
                      text-lg md:text-xl font-bold
                      ${selected === doctor.id ? 'text-white' : 'text-gray-900'}
                    `}>
                      ₹{doctor.fee}
                    </p>
                    <p className={`
                      text-[10px] md:text-xs font-medium
                      ${selected === doctor.id ? 'text-white/90' : 'text-gray-700'}
                    `}>
                      Per Consultation
                    </p>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="flex flex-wrap gap-1 md:gap-1.5 mb-2 md:mb-3">
                  {doctor.qualifications?.map((qual, index) => (
                    <span
                      key={index}
                      className={`
                        text-[10px] md:text-xs font-semibold px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full
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
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`
                      p-1 md:p-1.5 rounded-lg
                      ${selected === doctor.id ? 'bg-white/20' : 'bg-[#8B5C9E]/10'}
                    `}>
                      <Star className={`w-3 h-3 md:w-3.5 md:h-3.5 ${selected === doctor.id ? 'text-white' : 'text-[#8B5C9E]'}`} />
                    </div>
                    <div>
                      <p className={`text-xs md:text-sm font-semibold ${selected === doctor.id ? 'text-white' : 'text-gray-900'}`}>
                        {doctor.rating}
                      </p>
                      <p className={`text-[10px] font-medium ${selected === doctor.id ? 'text-white/90' : 'text-gray-700'}`}>
                        Rating
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className={`
                      p-1 md:p-1.5 rounded-lg
                      ${selected === doctor.id ? 'bg-white/20' : 'bg-[#8B5C9E]/10'}
                    `}>
                      <Award className={`w-3 h-3 md:w-3.5 md:h-3.5 ${selected === doctor.id ? 'text-white' : 'text-[#8B5C9E]'}`} />
                    </div>
                    <div>
                      <p className={`text-xs md:text-sm font-semibold ${selected === doctor.id ? 'text-white' : 'text-gray-900'}`}>
                        {doctor.experience}
                      </p>
                      <p className={`text-[10px] font-medium ${selected === doctor.id ? 'text-white/90' : 'text-gray-700'}`}>
                        Experience
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className={`
                      p-1 md:p-1.5 rounded-lg
                      ${selected === doctor.id ? 'bg-white/20' : 'bg-[#8B5C9E]/10'}
                    `}>
                      <Clock className={`w-3 h-3 md:w-3.5 md:h-3.5 ${selected === doctor.id ? 'text-white' : 'text-[#8B5C9E]'}`} />
                    </div>
                    <div>
                      <p className={`text-xs md:text-sm font-semibold ${selected === doctor.id ? 'text-white' : 'text-gray-900'}`}>
                        Available
                      </p>
                      <p className={`text-[10px] font-medium ${selected === doctor.id ? 'text-white/90' : 'text-gray-700'}`}>
                        Today
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className={`
                      p-1 md:p-1.5 rounded-lg
                      ${selected === doctor.id ? 'bg-white/20' : 'bg-[#8B5C9E]/10'}
                    `}>
                      <MapPin className={`w-3 h-3 md:w-3.5 md:h-3.5 ${selected === doctor.id ? 'text-white' : 'text-[#8B5C9E]'}`} />
                    </div>
                    <div>
                      <p className={`text-xs md:text-sm font-semibold ${selected === doctor.id ? 'text-white' : 'text-gray-900'}`}>
                        HSR Layout
                      </p>
                      <p className={`text-[10px] font-medium ${selected === doctor.id ? 'text-white/90' : 'text-gray-700'}`}>
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