import { FormEvent, useState } from "react";
import CancellationPolicy from "./CancellationPolicy";

interface BookingFormProps {
  onSubmit?: (formData: FormData) => void;  // Optional handler
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email required';
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) newErrors.cardNumber = 'Valid card number required';
    if (!formData.expirationDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) newErrors.expirationDate = 'MM/YY format';
    if (!formData.cvv.match(/^\d{3,4}$/)) newErrors.cvv = 'Valid CVV required';
    if (!formData.address.trim()) newErrors.address = 'Address required';
    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => submitData.append(key, value));
    onSubmit?.(submitData);  // Call parent handler
    console.log('Form submitted:', Object.fromEntries(submitData));  // Stub—integrate API
  };

  return (
    <div className="bg-white text-gray-700 p-6 rounded-lg shadow-md lg:order-2">
      <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
      
      <form onSubmit={handleSubmit} className="md:w-2/3 md:p-10 space-y-4">
        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Payment */}
        <h2 className="text-xl font-semibold mt-6">Pay with Card</h2>
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            maxLength={19}
            className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="1234 5678 9012 3456"
            required
          />
          {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expirationDate" className="block text-sm font-medium mb-1">Expiration Date</label>
            <input
              type="text"
              id="expirationDate"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              placeholder="MM/YY"
              className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            {errors.expirationDate && <p className="text-red-500 text-sm mt-1">{errors.expirationDate}</p>}
          </div>
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium mb-1">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              maxLength={4}
              className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
          </div>
        </div>

        {/* Billing Address */}
        <h2 className="text-xl font-semibold mt-6">Billing Address</h2>
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">Street Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="zip" className="block text-sm font-medium mb-1">Zip Code</label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={Object.keys(errors).length > 0}
          className="mt-6 bg-emerald-600 text-white py-2 rounded-md w-full font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Confirm & Pay
        </button>
      </form>

      <CancellationPolicy />
    </div>
  );
};

export default BookingForm;