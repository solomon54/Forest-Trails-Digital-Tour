// components/property/booking/SubmitButton.tsx
interface Props {
  isSubmitting: boolean;
  disabled: boolean;
}

const SubmitButton: React.FC<Props> = ({ isSubmitting, disabled }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`mt-12 ml-auto mr-auto w-3/5 py-5 rounded-lg text-xl font-bold transition-all flex items-center justify-center gap-3 ${
        disabled 
          ? "bg-emerald-600/50 text-gray-100  cursor-not-allowed border " 
          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md active:scale-95"
      }`}
    >
      {isSubmitting ? "Processing..." : "Confirm & Pay"}
    </button>
  );
};

export default SubmitButton;