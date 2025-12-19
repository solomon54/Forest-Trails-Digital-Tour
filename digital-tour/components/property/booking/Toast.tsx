// components/property/booking/Toast.tsx
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className={`px-6 py-4 rounded-lg shadow-lg font-medium text-white flex items-center gap-3 min-w-[300px] ${
        type === "success" ? "bg-emerald-600" : "bg-red-600"
      }`}>
        <span>{message}</span>
        <button onClick={onClose} className="ml-auto text-white hover:opacity-80">×</button>
      </div>
    </div>
  );
};

export default Toast;
