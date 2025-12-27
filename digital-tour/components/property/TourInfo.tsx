// components/property/TourInfo.tsx
import React from 'react';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';

interface Props {
  startDate?: string; // YYYY-MM-DD
}

const TourInfo: React.FC<Props> = ({ startDate }) => {
  // Fallback date if no startDate is selected
  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() + 3);
  const checkInDateObj = startDate ? new Date(startDate) : defaultStart;

  const formatDate = (date: Date, daysBefore: number = 0) => {
    const d = new Date(date);
    d.setDate(d.getDate() - daysBefore);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const freeCancelLimit = formatDate(checkInDateObj, 1);
  const checkInDate = formatDate(checkInDateObj, 0);

  return (
    <div className="space-y-12 sm:space-y-16">

      {/* --- Cancellation Policy Section --- */}
      <div className="p-6 sm:p-8 bg-emerald-50/30 rounded-3xl shadow-lg border border-emerald-100 space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Cancellation Policy</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-emerald-50 rounded-lg p-4 border-l-4 border-emerald-500">
            <HiOutlineCheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-1"/>
            <div>
              <span className="font-semibold text-gray-700">Full Refund</span>
              <p className="text-sm sm:text-base text-gray-600">
                Cancel before <span className="font-medium text-gray-900">{freeCancelLimit}</span> to receive a full refund.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500">
            <HiOutlineExclamationCircle className="w-6 h-6 text-amber-600 shrink-0 mt-1"/>
            <div>
              <span className="font-semibold text-gray-700">Partial Refund</span>
              <p className="text-sm sm:text-base text-gray-600">
                Cancel before check-in on <span className="font-medium text-gray-900">{checkInDate}</span> and get a refund minus the first night and service fee.
              </p>
            </div>
          </div>
        </div>
      </div>
  
      {/* --- Highlights Section --- */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl shadow-lg border border-gray-100 space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Highlights</h2>
        <ul className="space-y-3 text-gray-600 list-disc list-inside">
          <li>Explore the rich forest and wildlife around the area.</li>
          <li>Learn about the local cultural heritage and traditions.</li>
          <li>Guided tours that focus on nature, conservation, and sustainable travel.</li>
          <li>Perfect for out-of-town visitors seeking adventure and education.</li>
        </ul>
      </div>



      {/* --- Ground Rules Section --- */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl shadow-lg border border-gray-100 space-y-4 animate-in fade-in slide-in-from-bottom-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Ground Rules</h2>
        <p className="text-gray-600">
          We ask every guest to remember a few simple things about what makes a great visitor:
        </p>
        <ul className="space-y-2 text-gray-600 list-disc list-inside">
          <li>Follow the house rules and guidelines provided by the host.</li>
          <li>Respect the local environment and wildlife habitats.</li>
          <li>Treat local culture, traditions, and communities with care.</li>
          <li>Be punctual and mindful of scheduled tour times.</li>
          <li>Leave the space as you found it — clean and undisturbed.</li>
        </ul>
      </div>
    </div>
  );
};

export default TourInfo;
