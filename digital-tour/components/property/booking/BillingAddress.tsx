// components/property/booking/BillingAddress.tsx
import { ChangeEvent, FocusEvent, useMemo } from "react";

interface Props {
  values: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  touched: Record<string, boolean>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
}

const BillingAddress: React.FC<Props> = ({ values, touched, onChange, onBlur }) => {
  const billingErrors = useMemo(() => {
    const e: Record<string, string> = {};

    if (!values.address.trim()) e.address = "Street address is required";
    if (!values.city.trim()) e.city = "City is required";
    if (!values.state.trim()) e.state = "State/Province is required";

    const zipRegex = /^\d{5}(-\d{4})?$|^[A-Z\d ]{3,10}$/i;
    if (!values.zip.trim()) e.zip = "Zip code is required";
    else if (!zipRegex.test(values.zip)) e.zip = "Invalid zip format (e.g., 12345 or AB123)";

    if (!values.country.trim()) e.country = "Country is required";

    return e;
  }, [values]);

  const getStyle = (name: string) =>
    `w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-xl text-sm sm:text-base transition-all focus:outline-none focus:ring-2
     ${touched[name] && billingErrors[name] ? "border-red-500 bg-red-50 focus:ring-red-200" : "border-gray-300 focus:ring-emerald-500"}`;

  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
      <h2 className="text-xl sm:text-2xl font-bold mt-10 text-gray-900">Billing Address</h2>

      {/* Street Address */}
      <div className="mt-4 sm:mt-6">
        <label className="block text-sm font-medium mb-1 text-gray-700">Street Address</label>
        <input
          type="text"
          name="address"
          value={values.address}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="123 Main St"
          className={getStyle("address")}
        />
        {touched.address && billingErrors.address && (
          <p className="text-xs sm:text-sm text-red-600 mt-1">{billingErrors.address}</p>
        )}
      </div>

      {/* City & State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mt-4 sm:mt-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={values.city}
            onChange={onChange}
            onBlur={onBlur}
            className={getStyle("city")}
          />
          {touched.city && billingErrors.city && (
            <p className="text-xs sm:text-sm text-red-600 mt-1">{billingErrors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">State / Province</label>
          <input
            type="text"
            name="state"
            value={values.state}
            onChange={onChange}
            onBlur={onBlur}
            className={getStyle("state")}
          />
          {touched.state && billingErrors.state && (
            <p className="text-xs sm:text-sm text-red-600 mt-1">{billingErrors.state}</p>
          )}
        </div>
      </div>

      {/* Zip & Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mt-4 sm:mt-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Zip / Postal Code</label>
          <input
            type="text"
            name="zip"
            value={values.zip}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="e.g. 10001"
            className={getStyle("zip")}
          />
          {touched.zip && billingErrors.zip && (
            <p className="text-xs sm:text-sm text-red-600 mt-1">{billingErrors.zip}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Country</label>
          <input
            type="text"
            name="country"
            value={values.country}
            onChange={onChange}
            onBlur={onBlur}
            className={getStyle("country")}
          />
          {touched.country && billingErrors.country && (
            <p className="text-xs sm:text-sm text-red-600 mt-1">{billingErrors.country}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingAddress;
