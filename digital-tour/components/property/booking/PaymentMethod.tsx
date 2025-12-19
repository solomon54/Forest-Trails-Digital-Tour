// components/property/booking/PaymentMethod.tsx
import React from 'react';

/* ===========================
   MASK HELPERS (moved here)
=========================== */
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
  card: '/images/payment-card.png',
  telebirr: '/images/payment-telebirr.webp',
  cbe_chapa: '/images/payment-cbe.png'
};

interface Props {
  values: {
    paymentMethod: 'card' | 'telebirr' | 'cbe_chapa';
    phoneNumber: string;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
  };
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onMethodChange: (method: 'card' | 'telebirr' | 'cbe_chapa') => void;
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
    text.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  const getInputClass = (name: string) => `
    border p-3 w-full rounded-md focus:outline-none focus:ring-2 transition-all font-mono text-base
    ${touched[name] && errors[name]
      ? 'border-red-500 focus:ring-red-100 bg-red-50'
      : 'border-gray-400 focus:ring-emerald-500'}
  `;

  // Local masked change handlers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    // Create a fake event with formatted value
    const fakeEvent = {
      ...e,
      target: { ...e.target, name: e.target.name, value: formatted }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(fakeEvent);
  };

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpirationDate(e.target.value);
    const fakeEvent = {
      ...e,
      target: { ...e.target, name: e.target.name, value: formatted }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(fakeEvent);
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCVV(e.target.value);
    const fakeEvent = {
      ...e,
      target: { ...e.target, name: e.target.name, value: formatted }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(fakeEvent);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mt-10">Payment Method</h2>
      <div className="grid grid-cols-3 gap-6 mt-6">
        {(['card', 'telebirr', 'cbe_chapa'] as const).map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => onMethodChange(method)}
            className={`flex flex-col items-center p-6 border-2 rounded-xl transition-all duration-200 hover:shadow-md ${
              paymentMethod === method
                ? 'border-emerald-500 bg-emerald-50 shadow-md scale-105'
                : 'border-gray-300 hover:border-emerald-300'
            }`}
          >
            <img src={PaymentIcons[method]} alt={method} className="w-16 h-16 mb-3 object-contain" />
            <span className="text-base font-medium">{formatLabel(method)}</span>
          </button>
        ))}
      </div>

      {paymentMethod !== 'card' ? (
        <div className="mt-8">
          <label className="block text-sm font-medium mb-2">
            Phone Number <span className="text-gray-500">({formatLabel(paymentMethod)})</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={phoneNumber}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="+251 912 345 678"
            className={getInputClass('phoneNumber')}
          />
          {touched.phoneNumber && errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
          )}
        </div>
      ) : (
        <>
          <div className="mt-8">
            <label className="block text-sm font-medium mb-2">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={cardNumber}
              onChange={handleCardNumberChange}  
              onBlur={onBlur}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={getInputClass('cardNumber')}
            />
            {touched.cardNumber && errors.cardNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium mb-2">Expiration Date</label>
              <input
                type="text"
                name="expirationDate"
                value={expirationDate}
                onChange={handleExpirationChange}  
                onBlur={onBlur}
                placeholder="MM/YY"
                maxLength={5}
                className={getInputClass('expirationDate')}
              />
              {touched.expirationDate && errors.expirationDate && (
                <p className="text-red-500 text-xs mt-1">{errors.expirationDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CVV</label>
              <input
                type="text"
                name="cvv"
                value={cvv}
                onChange={handleCVVChange}  
                onBlur={onBlur}
                placeholder="123"
                maxLength={4}
                className={getInputClass('cvv')}
              />
              {touched.cvv && errors.cvv && (
                <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentMethod;