// components/property/CancellationPolicy.tsx
import React from 'react';

interface Props {
  startDate: string; // Expects YYYY-MM-DD
}

const CancellationPolicy: React.FC<Props> = ({ startDate }) => {
  const formatDate = (dateString: string, daysBefore: number = 0) => {
    if (!dateString) return "[Select Date]";
    
    const date = new Date(dateString);
    date.setDate(date.getDate() - daysBefore);
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Industry Standard: Full refund 1 day before, Partial on the day of.
  const freeCancelLimit = formatDate(startDate, 1);
  const checkInDate = formatDate(startDate, 0);

  return (
    <div className="mt-10 p-6 border-t border-gray-100">
      <h2 className="text-xl font-bold text-gray-800">Cancellation Policy</h2>
      <div className="mt-3 flex gap-4">
        <div className="flex flex-col w-full bg-emerald-600/15 border-l-4 border-emerald-500 p-4">
          <span className="font-semibold text-gray-700">Full refund</span>
          <p className="text-sm text-gray-600">
            Cancel before <span className="font-medium text-gray-900">{freeCancelLimit}</span> to get all your money back.
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-4">
        <div className="flex flex-col w-full bg-amber-600/15 border-l-4 border-amber-500 p-4">
          <span className="font-semibold text-gray-700">Partial refund</span>
          <p className="text-sm text-gray-600 ">
            Cancel before check-in on <span className="font-medium text-gray-900 ">{checkInDate}</span> and get a refund minus the first night and service fee.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-10 text-gray-800">Ground Rules</h2>
      <p className="mt-2 text-gray-600">
        We ask every guest to remember a few simple things about what makes a great guest.
      </p>
      <ul className="mt-3 space-y-2 text-gray-600 list-disc list-inside">
        <li>Follow the house rules</li>
        <li>Treat your Host&apos;s home like your own</li>
      </ul>
    </div>
  );
};

export default CancellationPolicy;