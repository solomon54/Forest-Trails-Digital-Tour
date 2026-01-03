// pages/notifications/index.tsx
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import NotificationsList from "@/components/notifications/NotificationsList";
import { BellIcon } from "@heroicons/react/24/outline";

export default function UserNotificationsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5 mb-10">
            <div className="p-4 bg-emerald-100 rounded-full shadow-sm">
              <BellIcon className="h-10 w-10 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Your Notifications
              </h1>
              <p className="text-slate-500 mt-1">
                Updates on your bookings and account.
              </p>
            </div>
          </div>

          {/* Unified: List handles its own unread counts and filtering */}
          <NotificationsList viewMode="user" />
        </div>
      </main>
      <Footer />
    </>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
