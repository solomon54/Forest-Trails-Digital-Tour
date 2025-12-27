// components/property/BookingForm.tsx
import { FormEvent, useState, ChangeEvent, useMemo } from "react";
import Toast from "./Toast";
import DateAvailability from "./DateAvailablity";
import ContactInfo from "./ContactInfo";
import PaymentMethod from "./PaymentMethod";
import BillingAddress from "./BillingAddress";
import SubmitButton from "./SubmitButton";
import CancellationPolicy from "../TourInfo";
import PriceSummary from "./PriceSummary";

interface BookingFormProps {
  listingId: number;
  userId: number;
}

const INITIAL_STATE = {
  firstName: "",
  lastName: "",
  email: "",
  paymentMethod: "card" as "card" | "telebirr" | "cbe_chapa",
  phoneNumber: "",
  cardNumber: "",
  expirationDate: "",
  cvv: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  startDate: "",
  endDate: ""
};

const BookingForm: React.FC<BookingFormProps> = ({ listingId, userId }) => {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  /* ===========================
     CORE VALIDATION LOGIC
  ============================ */
  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    // 1. Contact Info
    if (!formData.firstName.trim()) e.firstName = "First name is required";
    if (!formData.lastName.trim()) e.lastName = "Last name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Invalid email address";

    // 2. Payment Validation (with Expiry Date Logic)
    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
        e.cardNumber = "Must be 16 digits";
      }

      // --- Formal Expiration Validation ---
      const expiry = formData.expirationDate; // Expected format: MM/YY
      if (!expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        e.expirationDate = "Use MM/YY format";
      } else {
        const [expMonth, expYear] = expiry.split("/").map(Number);
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = Number(now.getFullYear().toString().slice(-2));

        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
          e.expirationDate = "Card is expired";
        }
      }

      if (!formData.cvv.match(/^\d{3,4}$/)) e.cvv = "3-4 digits";
    } else {
      if (!formData.phoneNumber.match(/^\+251[\s-]?\d{9}$/)) {
        e.phoneNumber = "Format: +251 9XXXXXXXX";
      }
    }

    // 3. Billing Validations (Formal Zip & State)
    if (!formData.address.trim()) e.address = "Address is required";
    if (!formData.city.trim()) e.city = "City is required";
    if (!formData.state.trim()) e.state = "State is required";

    // Strict Postal Code: Rejects random alphanumeric strings. 
    // Matches 5-digit US, 5-digit EU, or 3-10 char international patterns.
    const zipRegex = /^\d{5}(-\d{4})?$|^[A-Z\d ]{3,10}$/i;
    if (!formData.zip.trim()) {
      e.zip = "Zip code is required";
    } else if (!zipRegex.test(formData.zip)) {
      e.zip = "Invalid postal format";
    }

    if (!formData.country.trim()) e.country = "Country is required";

    return e;
  }, [formData]);

  const isFormValid = Object.keys(errors).length === 0;
  const isButtonDisabled = !isAvailable || !isFormValid || isSubmitting;

  /* ===========================
     HANDLERS
  ============================ */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "startDate" || name === "endDate") {
      setIsAvailable(null);
      setAvailabilityError(null);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const handleCheckAvailability = async () => {
    if (!formData.startDate || !formData.endDate) return;
    setCheckingAvailability(true);
    try {
      const res = await fetch("/api/bookings/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          listing_id: listingId, 
          start_date: formData.startDate, 
          end_date: formData.endDate 
        })
      });
      const data = await res.json();
      setIsAvailable(data.available);
      if (!data.available) setAvailabilityError(data.message);
    } catch (err) {
      setToast({ message: "Network error", type: "error" });
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !isAvailable) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          listing_id: listingId,
          start_date: formData.startDate,
          end_date: formData.endDate,
          payment_method: formData.paymentMethod,
          contact: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phoneNumber,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country
          }
        })
      });

      if (!res.ok) throw new Error("Booking failed");

      setToast({ message: "Booking Submitted successfully! 🎉", type: "success" });
      setFormData(INITIAL_STATE);
      setTouched({});
      setIsAvailable(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setToast({ message: err.message || "Something went wrong", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
        <form onSubmit={handleSubmit} className="md:w-3/4 mx-auto space-y-12" noValidate>
          
          <DateAvailability
            startDate={formData.startDate}
            endDate={formData.endDate}
            today={today}
            onChange={handleChange}
            onCheck={handleCheckAvailability}
            checking={checkingAvailability}
            isAvailable={isAvailable}
            availabilityError={availabilityError}
          />

          <div className="space-y-10 text-gray-700">
            <ContactInfo 
              values={formData} 
              errors={errors} 
              touched={touched} 
              onChange={handleChange} 
              onBlur={handleBlur} 
            />
            
            <PaymentMethod
              values={formData}
              errors={errors}
              touched={touched}
              onMethodChange={(m) => setFormData(prev => ({ ...prev, paymentMethod: m }))}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <BillingAddress 
              values={formData} 
              errors={errors} 
              touched={touched} 
              onChange={handleChange} 
              onBlur={handleBlur} 
            />

            <PriceSummary 
              startDate={formData.startDate} 
              endDate={formData.endDate} 
              pricePerNight={450} 
            />

            <SubmitButton isSubmitting={isSubmitting} disabled={isButtonDisabled} />
          </div>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <CancellationPolicy startDate={formData.startDate}  />
        </div>
      </div>
    </>
  );
};

export default BookingForm;