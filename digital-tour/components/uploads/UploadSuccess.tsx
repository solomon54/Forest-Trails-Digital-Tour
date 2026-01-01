// components/uploads/UploadSuccess.tsx
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { motion, useReducedMotion } from "framer-motion";

export default function UploadSuccess() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.95 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full px-4 sm:px-6 md:px-8">
      <div className="bg-linear-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 text-center w-full max-w-2xl mx-auto">
        {/* Large Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-emerald-100 mb-4 sm:mb-6 shadow-lg">
          <CheckCircleIcon className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-emerald-600" />
        </div>

        {/* Main Message */}
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-900 mb-3 sm:mb-4 md:mb-6 leading-snug flex items-center justify-center gap-1 sm:gap-2 mx-auto">
          Thank You for Sharing Ethiopia&apos;s Soul 🌿
        </motion.h3>

        {/* Description */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-sm sm:text-base md:text-lg text-emerald-800 mb-4 sm:mb-6 md:mb-8 max-w-full sm:max-w-xl mx-auto leading-relaxed">
          Your photo or video is pending review. Once approved, it will inspire
          travelers to discover and protect Ethiopia&apos;s sacred church
          forests and ancient trails.
        </motion.p>

        {/* What’s Next */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-2 sm:space-y-3">
          <p className="text-emerald-700 font-medium text-sm sm:text-base">
            Next Steps:
          </p>
          <ul className="text-emerald-800 text-xs sm:text-sm space-y-1 sm:space-y-2 max-w-full sm:max-w-md mx-auto list-disc list-inside">
            <li>We review your upload within 24–48 hours</li>
            <li>You will get a notification when it goes live</li>
            <li>Your contribution preserves Ethiopia’s heritage</li>
          </ul>
        </motion.div>

        {/* Final Touch */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-emerald-900 font-semibold text-sm sm:text-base">
          <span>&quot;ንሴብሐከ • እናመሰግናለን • Thank you&quot;</span>💖
        </motion.div>
      </div>
    </motion.div>
  );
}
