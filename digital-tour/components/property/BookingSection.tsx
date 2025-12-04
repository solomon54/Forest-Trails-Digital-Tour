// components/cards/BookingCard.tsx
import Link from "next/link";

interface BookingCardProps {
  id?: number | string;
  tourName: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  status: "pending" | "confirmed" | "cancelled";
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500",
  confirmed: "bg-emerald-600",
  cancelled: "bg-rose-500",
};

const BookingCard = ({
  id,
  tourName,
  location,
  startDate,
  endDate,
  price,
  status,
}: BookingCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition transform hover:-translate-y-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900">{tourName}</h3>
        <span className={`px-3 py-1 rounded-xl text-white text-sm sm:text-base ${statusColors[status]}`}>
          {/* {status.toUpperCase()} */}
        </span>
      </div>

      {/* Details */}
      <p className="text-sm sm:text-base text-slate-600 mb-1">{location}</p>
      <p className="text-sm sm:text-base text-slate-600 mb-2">
        {startDate} - {endDate}
      </p>
      <p className="text-md sm:text-lg font-medium text-emerald-600 mb-3">${price}</p>

      {id && (
        <Link href={`/tours/${id}`}>
          <button className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition font-medium">
            View Details
          </button>
        </Link>
      )}
    </div>
  );
};

export default BookingCard;
