// components/property/booking/PriceSummary.tsx
import { useState } from "react";
import { HiChevronDown } from "react-icons/hi";

const PriceSummary = ({ startDate, endDate, pricePerNight }: any) => {
  if (!startDate || !endDate) return null;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (nights <= 0) return null;

  const subtotal = nights * pricePerNight;
  const serviceFee = Number((subtotal * 0.03).toFixed(2));
  const total = subtotal + serviceFee;

  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto my-4 sm:my-6 px-3 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-emerald-50/20">
          <h3 className="text-lg sm:text-2xl font-extrabold text-gray-700 mb-4 sm:mb-6 text-center sm:text-left">
            Booking Summary
          </h3>

          {/* Nightly Rate */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
            <div className="flex flex-col">
              <span className="text-sm sm:text-xl font-semibold text-gray-600">Nightly Rate</span>
              <p className="text-xs sm:text-base text-gray-500 mt-1">
                ${pricePerNight.toLocaleString()} × {nights} {nights === 1 ? "night" : "nights"}
              </p>
            </div>
            <span className="text-lg sm:text-2xl font-bold text-gray-600">${subtotal.toLocaleString()}</span>
          </div>

          {/* Toggle Button with Rotating Icon */}
          <button
            className="mt-2 flex items-center gap-1 text-xs text-gray-500 underline hover:text-gray-600 transition-all shadow-md bg-gray-300 rounded-md pl-2 p-1 font-semibold"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide nightly details" : "Show nightly details"}
            <HiChevronDown
              className={`w-4 h-4 transform transition-transform duration-300 ${
                showDetails ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* Nightly Breakdown */}
          <div
            className={`mt-2 px-2 sm:px-3 py-2 bg-gray-50 rounded-lg text-gray-600 text-xs sm:text-sm space-y-1 shadow-inner overflow-hidden transition-all duration-300 ${
              showDetails ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {Array.from({ length: nights }, (_, i) => (
              <div key={i} className="flex justify-between">
                <span>Night {i + 1}</span>
                <span>${pricePerNight.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Service Fee */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mt-4">
            <div className="flex flex-col relative group">
              <span className="text-sm sm:text-xl font-semibold text-gray-600">Subtotal</span>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">3% service fee</p>
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg z-50">
                Covers platform & payment processing
              </span>
            </div>
            <span className="text-sm sm:text-2xl font-bold text-gray-600">${serviceFee.toLocaleString()}</span>
          </div>

          {/* Divider */}
          <div className="my-3 sm:my-4 h-px bg-gray-200" />

          {/* Total */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-emerald-50/40 p-3 sm:p-4 rounded-xl">
            <span className="text-lg sm:text-2xl font-extrabold text-gray-600">Total Payment</span>
            <span className="text-xl sm:text-3xl font-extrabold text-emerald-700/90 tracking-tight">
              ${total.toLocaleString()}
            </span>
          </div>

          {/* Footer Note */}
          <p className="mt-3 sm:mt-4 text-center sm:text-left text-xs sm:text-base text-gray-500">
            All amounts are in USD. Taxes included in service fee.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceSummary;
