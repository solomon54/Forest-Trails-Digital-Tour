// components/property/booking/SubmitButton.tsx
import { FaSpinner } from "react-icons/fa";

interface Props {
  isSubmitting: boolean;
  disabled: boolean;
}

const SubmitButton: React.FC<Props> = ({ isSubmitting, disabled }) => {
  return (
    <button
      type="submit"
      disabled={disabled || isSubmitting}
      className={`mt-12 ml-auto mr-auto px-2 w-3/5 py-2 sm:py-3 md:py-4 lg:py-5 xl:py-6 rounded-lg text-xl font-bold transition-all flex items-center justify-center gap-3
        ${disabled || isSubmitting
          ? "bg-emerald-600/50 text-gray-100 cursor-not-allowed border"
          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md active:scale-95"
        }`}
    >
      {isSubmitting && (
        <FaSpinner className="animate-spin w-5 h-5" />
      )}
      {isSubmitting ? "Processing..." : "Confirm & Pay"}
    </button>
  );
};

export default SubmitButton;
