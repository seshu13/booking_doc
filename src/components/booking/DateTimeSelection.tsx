'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, isSameDay, isAfter, startOfToday, isWeekend } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateTimeSelectionProps {
  selected: {
    date: Date | null;
    time: string;
  };
  onSelect: (dateTime: { date: Date; time: string }) => void;
  onBack: () => void;
}

const timeSlots = [
  { time: '09:00', label: '9:00 AM' },
  { time: '09:30', label: '9:30 AM' },
  { time: '10:00', label: '10:00 AM' },
  { time: '10:30', label: '10:30 AM' },
  { time: '11:00', label: '11:00 AM' },
  { time: '11:30', label: '11:30 AM' },
  { time: '14:00', label: '2:00 PM' },
  { time: '14:30', label: '2:30 PM' },
  { time: '15:00', label: '3:00 PM' },
  { time: '15:30', label: '3:30 PM' },
  { time: '16:00', label: '4:00 PM' },
  { time: '16:30', label: '4:30 PM' }
];

const DateTimeSelection = ({ selected, onSelect, onBack }: DateTimeSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(selected.date);
  const [selectedTime, setSelectedTime] = useState<string>(selected.time);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const today = startOfToday();
  const dates = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (selectedTime) {
      onSelect({ date, time: selectedTime });
    }
    // Scroll to time selection on mobile
    if (isMobile) {
      setTimeout(() => {
        document.getElementById('time-selection')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSelect({ date: selectedDate, time });
    }
  };

  const isDateSelectable = (date: Date) => {
    return isAfter(date, today) || isSameDay(date, today);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-[#8B5C9E] hover:text-[#6B4A7E] font-medium flex items-center gap-1
                   active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-[#1a1a1a] mb-1">
          Select Date & Time
        </h1>
        <p className="text-sm md:text-base text-[#4a4a4a] font-medium">
          Choose your preferred appointment slot
        </p>
      </div>

      {/* Date Selection */}
      <div className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-medium text-[#1a1a1a]">Select Date</h2>
          <div className="flex gap-1 md:gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-full hover:bg-[#8B5C9E]/5 text-[#8B5C9E] transition-colors
                       active:scale-95 transition-transform touch-manipulation"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-full hover:bg-[#8B5C9E]/5 text-[#8B5C9E] transition-colors
                       active:scale-95 transition-transform touch-manipulation"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-2 md:gap-3 overflow-x-auto pb-2 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
        >
          {dates.map((date) => {
            const isSelectable = isDateSelectable(date);
            const isSelected = selectedDate && isSameDay(selectedDate, date);
            const isWeekendDay = isWeekend(date);

            return (
              <button
                key={date.toISOString()}
                onClick={() => isSelectable && handleDateSelect(date)}
                disabled={!isSelectable}
                className={`
                  flex-none w-16 md:w-20 py-2.5 md:py-3 rounded-xl text-center transition-all
                  active:scale-95 touch-manipulation
                  ${isSelected
                    ? 'bg-gradient-to-br from-[#8B5C9E] to-[#6B4A7E] text-white shadow-md'
                    : isSelectable
                      ? isWeekendDay
                        ? 'bg-[#8B5C9E]/5 hover:bg-[#8B5C9E]/10 text-[#1a1a1a]'
                        : 'bg-white hover:bg-[#8B5C9E]/5 text-[#1a1a1a] border border-gray-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <p className="text-xs md:text-sm font-medium mb-1">
                  {format(date, 'EEE')}
                </p>
                <p className="text-xl md:text-2xl font-bold leading-none mb-1">
                  {format(date, 'd')}
                </p>
                <p className="text-xs md:text-sm font-medium">
                  {format(date, 'MMM')}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <motion.div
          id="time-selection"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 md:space-y-4 scroll-mt-4"
        >
          <h2 className="text-base md:text-lg font-medium text-[#1a1a1a]">Select Time</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
            {timeSlots.map(({ time, label }) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`
                  py-2.5 md:py-3 rounded-xl text-center transition-all text-xs md:text-sm font-medium
                  active:scale-95 touch-manipulation
                  ${selectedTime === time
                    ? 'bg-gradient-to-br from-[#8B5C9E] to-[#6B4A7E] text-white shadow-md'
                    : 'bg-white hover:bg-[#8B5C9E]/5 text-[#1a1a1a] border border-gray-200'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default DateTimeSelection;
