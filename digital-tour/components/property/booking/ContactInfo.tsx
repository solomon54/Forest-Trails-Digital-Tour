// components/property/booking/ContactInfo.tsx
import { ChangeEvent, FocusEvent } from "react";

interface Props {
  values: any;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
}

const ContactInfo: React.FC<Props> = ({ values, errors, touched, onChange, onBlur }) => {
  const getStyle = (name: string) =>
    `border p-2 sm:p-3 w-full rounded-md focus:outline-none focus:ring-2 transition-all ${
      touched[name] && errors[name]
        ? "border-red-500 focus:ring-red-200 bg-red-50"
        : "border-gray-400 focus:ring-emerald-500"
    }`;

  return (
    <div>
      <h2 className="text-xl text-gray-700 sm:text-2xl font-bold mt-8">Contact Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            name="firstName"
            value={values.firstName}
            onChange={onChange}
            onBlur={onBlur}
            className={getStyle("firstName")}
          />
          {touched.firstName && errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            name="lastName"
            value={values.lastName}
            onChange={onChange}
            onBlur={onBlur}
            className={getStyle("lastName")}
          />
          {touched.lastName && errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="mt-4 md:mt-6">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={onChange}
          onBlur={onBlur}
          className={getStyle("email")}
        />
        {touched.email && errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
    </div>
  );
};

export default ContactInfo;