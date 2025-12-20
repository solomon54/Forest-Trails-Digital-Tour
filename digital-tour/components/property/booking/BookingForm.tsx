// components/property/BookingForm.tsx
import { FormEvent, useState, ChangeEvent, useMemo } from "react";
import Toast from "./Toast";
import DateAvailability from "./DateAvailablity";
import ContactInfo from "./ContactInfo";
import PaymentMethod from "./PaymentMethod";
import BillingAddress from "./BillingAddress";
import SubmitButton from "./SubmitButton";
import CancellationPolicy from "../CancellationPolicy";

/* ===========================
   MASK HELPERS
=========================== */
const formatCardNumber = (value: string) =>
  value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpirationDate = (value: string) =>
  value.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d{0,2})$/, "$1/$2");

const formatCVV = (value: string) =>
  value.replace(/\D/g, "").slice(0, 4);

interface BookingFormProps {
  listingId: number;
  userId: number;
}

const BookingForm: React.FC<BookingFormProps> = ({ listingId, userId }) => {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
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
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  /* ===========================
     VALIDATION
  ============================ */
  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    if (!formData.firstName.trim()) e.firstName = "First name is required";
    if (!formData.lastName.trim()) e.lastName = "Last name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = "Invalid email address";
    }

    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
        e.cardNumber = "Must be 16 digits";
      }

      const match = formData.expirationDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/);
      if (!match) {
        e.expirationDate = "Use MM/YY format";
      } else {
        const [month, year] = formData.expirationDate.split("/").map(Number);
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = Number(now.getFullYear().toString().slice(-2));

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          e.expirationDate = "Card has expired";
        }
      }

      if (!formData.cvv.match(/^\d{3,4}$/)) {
        e.cvv = "3 or 4 digits";
      }
    } else {
      if (!formData.phoneNumber.match(/^\+251[\s-]?\d{9}$/)) {
        e.phoneNumber = "Format: +251 9XXXXXXXX";
      }
    }

    if (!formData.address.trim()) e.address = "Address is required";
    if (!formData.city.trim()) e.city = "City is required";
    if (!formData.zip.trim()) {
      e.zip = "Zip / Postal code is required";
    } else if (!/^[A-Za-z0-9\s-]{3,10}$/.test(formData.zip)) {
      e.zip = "Invalid postal code format";
    }
    if (!formData.country.trim()) e.country = "Country is required";

    return e;
  }, [formData]);

  const isFormValid = Object.keys(errors).length === 0;
  const isButtonDisabled = !isAvailable || !isFormValid || isSubmitting;

 /* ===========================
   HANDLERS
=========================== */
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  // REMOVED MASKING HERE — now handled inside PaymentMethod
  // Just update the form state normally
  setFormData(prev => ({ ...prev, [name]: value }));

  // Reset availability when dates change
  if (name === "startDate" || name === "endDate") {
    setIsAvailable(null);
    setAvailabilityError(null);
  }
};

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  /* ===========================
     AVAILABILITY CHECK
  ============================ */
  const handleCheckAvailability = async () => {
    if (checkingAvailability) return;

    if (!formData.startDate || !formData.endDate) {
      showToast("Please select both dates.", "error");
      return;
    }

    setCheckingAvailability(true);
    setIsAvailable(null);
    setAvailabilityError(null);

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

      if (!res.ok) {
        throw new Error(data.message || "Availability check failed.");
      }

      setIsAvailable(data.available);

      if (data.available) {
        showToast("Dates are available 🎉", "success");
      } else {
        setAvailabilityError(data.message || "Dates not available.");
      }
    } catch (err: any) {
      setIsAvailable(false);
      setAvailabilityError(err.message || "Server error.");
      showToast(err.message || "Failed to check availability.", "error");
    } finally {
      setCheckingAvailability(false);
    }
  };

  /* ===========================
     SUBMIT
  ============================ */
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
            zip: formData.zip,
            country: formData.country
          }
        })
      });

      if (!res.ok) throw new Error("Booking failed");

      showToast("Booking Submited successfuly! 🎉", "success");

      // Reset form on success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        paymentMethod: "card",
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
      });
      setTouched({});
      setIsAvailable(null);
      setAvailabilityError(null);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===========================
     RENDER
  ============================ */
  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="md:w-2/3 mx-auto space-y-8" noValidate>
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

          {/* {isAvailable === true && ( */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
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
              <SubmitButton isSubmitting={isSubmitting} disabled={isButtonDisabled} />
            </div>
        {/*    )} */}
        </form>

        <CancellationPolicy startDate={formData.startDate}  />
      </div>
    </>
  );
};

export default BookingForm;