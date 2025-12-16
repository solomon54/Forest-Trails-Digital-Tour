// components/property/BookingForm.tsx
import { FormEvent, useState, ChangeEvent, useEffect } from "react";
import CancellationPolicy from "./CancellationPolicy";

const PaymentIcons = {
  card: '/images/payment-card.png',
  telebirr: '/images/payment-telebirr.webp',
  cbe_chapa: '/images/payment-cbe.png'
};

interface BookingFormProps {
  listingId: number;
  userId: number;
  checkAvailability?: (start_date: string, end_date: string) => Promise<boolean>;
}

// Toast component (inline, lightweight)
const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 5000); // Auto-dismiss after 5s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className={`px-6 py-4 rounded-lg shadow-lg font-medium text-white flex items-center gap-3 min-w-[300px] ${
        type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
      }`}>
        <span>{message}</span>
        <button onClick={onClose} className="ml-auto text-white hover:opacity-80">
          ×
        </button>
      </div>
    </div>
  );
};

const BookingForm: React.FC<BookingFormProps> = ({ listingId, userId, checkAvailability }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    paymentMethod: 'card' as 'card' | 'telebirr' | 'cbe_chapa',
    phoneNumber: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    startDate: '',
    endDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityMsg, setAvailabilityMsg] = useState<string | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const closeToast = () => setToast(null);

  // --- Validation (unchanged) ---
  const validateField = (name: string, value: string): string => {
    // ... (keep your full validateField function exactly as before)
    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'address':
      case 'city':
      case 'state':
      case 'country':
        return !value.trim() ? `${name.replace(/([A-Z])/g, ' $1').trim()} is required` : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Valid email required' : '';
      case 'phoneNumber':
        if (formData.paymentMethod !== 'card')
          return !value.match(/^\+251\s?\d{9,10}$/) ? 'Valid Ethiopian phone (+251 followed by 9-10 digits)' : '';
        return '';
      case 'cardNumber':
        if (formData.paymentMethod === 'card')
          return !value.replace(/\s/g, '').match(/^\d{16}$/) ? 'Valid 16-digit card number required' : '';
        return '';
      case 'expirationDate':
        if (formData.paymentMethod === 'card')
          return !value.match(/^(0[1-9]|1[0-2])\/\d{2}$/) ? 'Expiration must be MM/YY' : '';
        return '';
      case 'cvv':
        if (formData.paymentMethod === 'card')
          return !value.match(/^\d{3,4}$/) ? 'CVV must be 3 or 4 digits' : '';
        return '';
      case 'zip':
        return !value.match(/^\d{5}(-\d{4})?$/) ? 'Valid ZIP code required' : '';
      case 'startDate':
        return !value ? 'Start date is required' : '';
      case 'endDate':
        if (!value) return 'End date is required';
        if (formData.startDate && value <= formData.startDate) return 'End date must be after start date';
        return '';
      default:
        return '';
    }
  };

  const isFormValid = (): boolean => {
    const fields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zip', 'country', 'startDate', 'endDate'];
    for (const field of fields) {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) return false;
    }
    if (formData.paymentMethod === 'card') {
      if (validateField('cardNumber', formData.cardNumber)) return false;
      if (validateField('expirationDate', formData.expirationDate)) return false;
      if (validateField('cvv', formData.cvv)) return false;
    } else {
      if (validateField('phoneNumber', formData.phoneNumber)) return false;
    }
    return true;
  };

  // --- Handlers (unchanged) ---
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => (error ? { ...prev, [name]: error } : { ...prev, [name]: undefined }));
  };

  const handlePaymentChange = (method: 'card' | 'telebirr' | 'cbe_chapa') => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
    setErrors(prev => {
      if (method === 'card') {
        const { phoneNumber, ...rest } = prev;
        return rest;
      } else {
        const { cardNumber, expirationDate, cvv, ...rest } = prev;
        return rest;
      }
    });
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // --- Submit ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAvailabilityMsg(null);

    // Mark all fields as touched
    setTouched(prev => ({
      ...prev,
      ...Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    }));

    if (!isFormValid()) {
      showToast("Please fix the errors in the form.", "error");
      setIsSubmitting(false);
      return;
    }

    // Availability check
    if (checkAvailability && formData.startDate && formData.endDate) {
      const available = await checkAvailability(formData.startDate, formData.endDate);
      if (!available) {
        setAvailabilityMsg("Selected dates are already booked.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const bookingPayload = {
        user_id: userId,
        listing_id: listingId,
        start_date: formData.startDate,
        end_date: formData.endDate,
        payment_method: formData.paymentMethod
      };

      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload)
      });

      if (!bookingRes.ok) {
        const err = await bookingRes.json();
        showToast(err.message || "Booking failed. Please try again.", "error");
        setIsSubmitting(false);
        return;
      }

      // Success!
      showToast("Your booking has been successfully Submited! 🎉", "success");

      // Full reset
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        paymentMethod: 'card',
        phoneNumber: '',
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        startDate: '',
        endDate: ''
      });
      setErrors({});
      setTouched({});
      setAvailabilityMsg(null);
    } catch (error) {
      console.error("Submission error:", error);
      showToast("Something went wrong. Please try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLocalPayment = formData.paymentMethod !== 'card';

  return (
    <>
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="bg-white text-gray-700 p-6 rounded-lg shadow-md lg:order-2">
        <form onSubmit={handleSubmit} className="md:w-2/3 md:p-10 mx-auto space-y-4">
          
          {/* Dates */}
          <div>
            <h2 className="text-xl font-semibold mt-6">Check-in & Check-out Dates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium mb-1">Start Date</label>
                <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} onBlur={handleBlur}
                  min={new Date().toISOString().split('T')[0]}
                  className={`border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${touched.startDate && errors.startDate ? 'border-red-500' : 'border-gray-400'}`} />
                {touched.startDate && errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium mb-1">End Date</label>
                <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} onBlur={handleBlur}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className={`border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${touched.endDate && errors.endDate ? 'border-red-500' : 'border-gray-400'}`} />
                {touched.endDate && errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>

            {/* Centered availability error */}
            {availabilityMsg && (
              <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg text-center font-medium">
                {availabilityMsg}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-semibold mt-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* First & Last Name fields */}
              {/* ... (same as before) */}
            </div>
            <div className="mt-4">
              {/* Email field */}
            </div>
          </div>


      {/* Contact Info */}
      <div>
        <h2 className="text-xl font-semibold mt-6">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                touched.firstName && errors.firstName ? 'border-red-500' : 'border-gray-400'
              }`}
            />
            {touched.firstName && errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                touched.lastName && errors.lastName ? 'border-red-500' : 'border-gray-400'
              }`}
            />
            {touched.lastName && errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              touched.email && errors.email ? 'border-red-500' : 'border-gray-400'
            }`}
          />
          {touched.email && errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Payment Method */}
      <h2 className="text-xl font-semibold mt-6">Payment Method</h2>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {(['card', 'telebirr', 'cbe_chapa'] as const).map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => handlePaymentChange(method)}
            className={`
              flex flex-col items-center p-4 border-2 rounded-xl transition-all duration-200 hover:shadow-md
              ${formData.paymentMethod === method
                ? 'border-emerald-500 bg-emerald-50 shadow-md scale-105'
                : 'border-gray-300 hover:border-emerald-300'
              }
            `}
          >
            <img
              src={PaymentIcons[method]}
              alt={`${method.replace('_', ' ')} icon`}
              className="w-12 h-12 mb-2 object-contain"
            />
            <span className="text-sm font-medium capitalize">{method.replace('_', ' ')}</span>
          </button>
        ))}
      </div>

      {/* Conditional Payment Fields */}
      {!isLocalPayment ? (
        <>
          <div className="mt-4">
            <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={`border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                touched.cardNumber && errors.cardNumber ? 'border-red-500' : 'border-gray-400'
              }`}
            />
            {touched.cardNumber && errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="expirationDate" className="block text-sm font-medium mb-1">Expiration Date</label>
              <input
                type="text"
                id="expirationDate"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="MM/YY"
                className={`border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  touched.expirationDate && errors.expirationDate ? 'border-red-500' : 'border-gray-400'
                }`}
              />
              {touched.expirationDate && errors.expirationDate && <p className="text-red-500 text-sm mt-1">{errors.expirationDate}</p>}
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium mb-1">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={4}
                className={`border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  touched.cvv && errors.cvv ? 'border-red-500' : 'border-gray-400'
                }`}
              />
              {touched.cvv && errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
            Phone Number ({formData.paymentMethod.replace('_', ' ')})
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="+251 9XX XXX XXX"
            className={`border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : 'border-gray-400'
            }`}
          />
          {touched.phoneNumber && errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
        </div>
      )}

      {/* Billing Address */}
      <h2 className="text-xl font-semibold mt-6">Billing Address</h2>
      <div className="mt-4">
        <label htmlFor="address" className="block text-sm font-medium mb-1">Street Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            touched.address && errors.address ? 'border-red-500' : 'border-gray-400'
          }`}
        />
        {touched.address && errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              touched.city && errors.city ? 'border-red-500' : 'border-gray-400'
            }`}
          />
          {touched.city && errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium mb-1">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              touched.state && errors.state ? 'border-red-500' : 'border-gray-400'
            }`}
          />
          {touched.state && errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="zip" className="block text-sm font-medium mb-1">Zip Code</label>
          <input
            type="text"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              touched.zip && errors.zip ? 'border-red-500' : 'border-gray-400'
            }`}
          />
          {touched.zip && errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              touched.country && errors.country ? 'border-red-500' : 'border-gray-400'
            }`}
          />
          {touched.country && errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>
      </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className="mt-6 w-full bg-emerald-600 text-white py-3 rounded-md font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              'Confirm & Pay'
            )}
          </button>
        </form>

        <CancellationPolicy startDate={formData.startDate} endDate={formData.endDate} />
      </div>
    </>
  );
};

export default BookingForm;







