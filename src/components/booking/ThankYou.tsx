'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Check } from 'lucide-react';

interface ThankYouProps {
  bookingData: {
    doctor: string;
    date: Date | null;
    time: string;
  };
  onClose: () => void;
}

const ThankYou = ({ bookingData, onClose }: ThankYouProps) => {
  const doctorName = bookingData.doctor === 'dr-sameer' ? 'Dr. Sameer' : 'Other Doctor';
  const doctorFee = bookingData.doctor === 'dr-sameer' ? 700 : 1000;

  const addToCalendar = () => {
    if (!bookingData.date) return;

    const [hours, minutes] = bookingData.time.split(':');
    const startDate = new Date(bookingData.date);
    startDate.setHours(parseInt(hours), parseInt(minutes));
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    const event = {
      title: `Appointment with ${doctorName}`,
      description: `Medical appointment at Sports Orthopedics Institute\nDoctor: ${doctorName}\nFee: ₹${doctorFee}`,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      location: 'Sports Orthopedics Institute',
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
    }/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
    }&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(
      event.location
    )}`;

    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 md:space-y-8 text-center px-2 md:px-4"
    >
      <div className="flex flex-col items-center space-y-3 md:space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center"
        >
          <Check className="w-7 h-7 md:w-8 md:h-8 text-green-600" />
        </motion.div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Booking Confirmed!</h2>
        <p className="text-sm md:text-base font-medium text-gray-600 max-w-md">
          Your appointment with {doctorName} has been scheduled for{' '}
          {bookingData.date && (
            <span className="text-gray-900">
              {format(bookingData.date, 'EEEE, MMMM d')} at {bookingData.time}
            </span>
          )}
        </p>
      </div>

      <div className="space-y-4 md:space-y-6">
        <motion.button
          onClick={addToCalendar}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg 
                   bg-[#8B5C9E] text-white font-medium text-sm md:text-base
                   hover:bg-[#7B4C8E] transition-colors w-full
                   active:scale-95 touch-manipulation"
        >
          <Calendar className="w-4 h-4 md:w-5 md:h-5" />
          <span>Add to Google Calendar</span>
        </motion.button>

        <div className="text-xs md:text-sm font-medium text-gray-600 px-4">
          A confirmation email has been sent to your email address
        </div>
      </div>
    </motion.div>
  );
};

export default ThankYou; 