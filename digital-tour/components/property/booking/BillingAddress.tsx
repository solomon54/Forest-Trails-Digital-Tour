// components/property/booking/BillingAddress.tsx
import { ChangeEvent } from "react";

interface Props {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const BillingAddress: React.FC<Props> = ({ address, city, state, zip, country, onChange }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mt-10">Billing Address</h2>
      <div className="mt-6">
        <label className="block text-sm font-medium mb-1">Street Address</label>
        <input
          type="text"
          name="address"
          value={address}
          onChange={onChange}
          className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-400"
        />
      </div>
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input type="text" name="city" value={city} onChange={onChange} className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input type="text" name="state" value={state} onChange={onChange} className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium mb-1">Zip Code</label>
          <input type="text" name="zip" value={zip} onChange={onChange} className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input type="text" name="country" value={country} onChange={onChange} className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default BillingAddress;