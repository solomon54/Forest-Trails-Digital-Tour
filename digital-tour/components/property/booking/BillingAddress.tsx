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
  
  /* ===========================
     INTERNAL VALIDATION LOGIC
  ============================ */
  const billingErrors = useMemo(() => {
    const e: Record<string, string> = {};

    if (!values.address.trim()) e.address = "Street address is required";
    if (!values.city.trim()) e.city = "City is required";
    if (!values.state.trim()) e.state = "State/Province is required";
    
    // Strict Zip Validation: Supports 5-digit US or 3-10 char Alphanumeric Intl
    const zipRegex = /^\d{5}(-\d{4})?$|^[A-Z\d ]{3,10}$/i;
    if (!values.zip.trim()) {
      e.zip = "Zip code is required";
    } else if (!zipRegex.test(values.zip)) {
      e.zip = "Invalid zip format (e.g., 12345 or AB123)";
    }

    if (!values.country.trim()) e.country = "Country is required";

    return e;
  }, [values]);

  // Helper for dynamic styling
  const getStyle = (name: string) => `border p-3 w-full rounded-md focus:outline-none focus:ring-2 transition-all ${
    touched[name] && billingErrors[name] 
      ? "border-red-500 focus:ring-red-200 bg-red-50" 
      : "border-gray-400 focus:ring-emerald-500"
  }`;

  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
      <h2 className="text-2xl font-bold mt-10">Billing Address</h2>
      
      {/* Address */}
      <div className="mt-6">
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
          <p className="text-red-500 text-xs mt-1 font-medium">{billingErrors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* City */}
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
            <p className="text-red-500 text-xs mt-1 font-medium">{billingErrors.city}</p>
          )}
        </div>

        {/* State */}
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
            <p className="text-red-500 text-xs mt-1 font-medium">{billingErrors.state}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Zip */}
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
            <p className="text-red-500 text-xs mt-1 font-medium">{billingErrors.zip}</p>
          )}
        </div>

        {/* Country */}
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
            <p className="text-red-500 text-xs mt-1 font-medium">{billingErrors.country}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingAddress;