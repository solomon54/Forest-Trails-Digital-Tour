// components/uploads/UploadProgress.tsx
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  percentage: number; // 0–100
  speed?: string; // e.g. "2.4 MB/s"
};

export default function UploadProgress({ percentage, speed }: Props) {
  const prefersReducedMotion = useReducedMotion();

  // Adaptive sizing (single source of truth)
  const size = {
    base: 140, // very small phones
    sm: 180, // phones
    md: 220, // tablets+
  };

  const radius = 54;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="mt-8 flex flex-col items-center gap-5 px-4">
      {/* Progress Ring */}
      <div
        className="
          relative
          w-[140px] h-[140px]
          sm:w-[180px] sm:h-[180px]
          md:w-[220px] md:h-[220px]
        ">
        <svg
          viewBox="0 0 140 140"
          className="w-full h-full -rotate-90"
          aria-hidden>
          {/* Track */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="rgb(226 232 240)" // slate-200
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress */}
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            stroke="rgb(16 185 129)" // emerald-600
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            style={{ strokeDasharray: circumference }}
            initial={
              prefersReducedMotion ? false : { strokeDashoffset: circumference }
            }
            animate={{ strokeDashoffset: offset }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.6,
              ease: "easeOut",
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div
            key={percentage}
            initial={prefersReducedMotion ? false : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}>
            <p
              className="
                font-extrabold text-emerald-700
                text-3xl sm:text-4xl md:text-5xl
              ">
              {percentage}%
            </p>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
              Uploaded
            </p>
          </motion.div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center space-y-1">
        {speed && (
          <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-700">
            {speed}
          </p>
        )}
        <p className="text-xs sm:text-sm text-slate-500">
          Keep this tab open until upload completes
        </p>
      </div>

      {/* Encouragement */}
      <p className="text-center text-emerald-700 font-medium text-xs sm:text-sm md:text-base max-w-xs sm:max-w-md">
        Your contribution is almost ready to inspire others 🌍
      </p>
    </div>
  );
}
