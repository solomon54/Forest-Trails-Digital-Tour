// components/property/booking/PaymentMethod.tsx
import React from "react";

const formatCardNumber = (value: string) =>
  value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpirationDate = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 2) {
    return digits.slice(0, 2) + (digits.length > 2 ? "/" + digits.slice(2) : "/");
  }
  return digits;
};

const formatCVV = (value: string) =>
  value.replace(/\D/g, "").slice(0, 4);

const PaymentIcons = {
  card: "/images/payment-card.png",
  telebirr: "/images/payment-telebirr.webp",
  cbe_chapa: "/images/payment-cbe.png",
};

interface Props {
  values: {
    paymentMethod: "card" | "telebirr" | "cbe_chapa";
    phoneNumber: string;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
  };
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onMethodChange: (method: "card" | "telebirr" | "cbe_chapa") => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const PaymentMethod: React.FC<Props> = ({
  values,
  errors,
  touched,
  onMethodChange,
  onChange,
  onBlur,
}) => {
  const { paymentMethod, phoneNumber, cardNumber, expirationDate, cvv } = values;

  const formatLabel = (text: string) =>
    text.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const getInputClass = (name: string) => `
    w-full px-4 py-3.5 border rounded-xl text-base transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500
    ${touched[name] && errors[name]
      ? "border-red-500 bg-red-50 focus:ring-red-200"
      : "border-gray-300 focus:border-emerald-500"}
  `;

  // Masked handlers
 const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const formatted = formatCardNumber(e.target.value);
  onChange({ target: { name: "cardNumber", value: formatted } } as any);
};

const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const formatted = formatExpirationDate(e.target.value);
  onChange({ target: { name: "expirationDate", value: formatted } } as any);
};

const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const formatted = formatCVV(e.target.value);
  onChange({ target: { name: "cvv", value: formatted } } as any);
};


  return (
    <div className="space-y-6 sm:space-y-8">
  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Method</h2>

  {/* Payment Options */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
    {(["card", "telebirr", "cbe_chapa"] as const).map((method) => (
      <button
        key={method}
        type="button"
        onClick={() => onMethodChange(method)}
        className={`
          relative flex flex-col items-center justify-center sm:p-2 md:p-4 rounded-2xl border-2 transition-all duration-300
          ${paymentMethod === method
            ? "border-emerald-600 bg-emerald-50 shadow-lg scale-105"
            : "border-gray-200 hover:border-emerald-400 hover:shadow-md"}
        `}
      >
        <img
          src={PaymentIcons[method]}
          alt={formatLabel(method)}
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-3 sm:mb-4"
        />
        <span className="text-sm sm:text-lg font-semibold text-gray-800">
          {formatLabel(method)}
        </span>

        {paymentMethod === method && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-emerald-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>
    ))}
  </div>

  {/* Conditional Fields */}
  <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
    {paymentMethod !== "card" ? (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          Phone Number <span className="font-normal text-gray-600">({formatLabel(paymentMethod)})</span>
        </label>
        <input
          type="tel"
          name="phoneNumber"
          value={phoneNumber}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="+251 912 345 678"
          className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-xl text-sm sm:text-base transition focus:outline-none focus:ring-2 focus:ring-emerald-500
            ${touched.phoneNumber && errors.phoneNumber ? "border-red-500 bg-red-50 focus:ring-red-200" : "border-gray-300"}
          `}
        />
        {touched.phoneNumber && errors.phoneNumber && (
          <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.phoneNumber}</p>
        )}
      </div>
    ) : (
      <div className="space-y-4 sm:space-y-6">
        {/* Card Number */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={cardNumber}
            onChange={handleCardNumberChange}
            onBlur={onBlur}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-xl text-sm sm:text-base transition focus:outline-none focus:ring-2 focus:ring-emerald-500
              ${touched.cardNumber && errors.cardNumber ? "border-red-500 bg-red-50 focus:ring-red-200" : "border-gray-300"}
            `}
          />
          {touched.cardNumber && errors.cardNumber && (
            <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.cardNumber}</p>
          )}
        </div>

        {/* Exp + CVV */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Expiration Date</label>
            <input
              type="text"
              name="expirationDate"
              value={expirationDate}
              onChange={handleExpirationChange}
              onBlur={onBlur}
              placeholder="MM/YY"
              maxLength={5}
              className={getInputClass("expirationDate")}
            />
            {touched.expirationDate && errors.expirationDate && (
              <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.expirationDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">CVV</label>
            <input
              type="text"
              name="cvv"
              value={cvv}
              onChange={handleCVVChange}
              onBlur={onBlur}
              placeholder="123"
              maxLength={4}
              className={getInputClass("cvv")}
            />
            {touched.cvv && errors.cvv && (
              <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
</div>

  );
};

export default PaymentMethod;