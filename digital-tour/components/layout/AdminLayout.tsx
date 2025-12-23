//layuout/MainLayout.tsx
import Navbar from "../navbar/Navbar";
import Footer from "./Footer";
import { useState } from "react";
import AdminSidebar from "../admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* TOP NAVBAR */}
      <Navbar />

      <div className="flex flex-1">
        {/* MOBILE SIDEBAR TOGGLE */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white px-3 py-2 rounded shadow sm:mt-70"
        >
          ☰
        </button>

        {/* SIDEBAR (mobile + desktop) */}
        <AdminSidebar open={open} setOpen={setOpen} />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 ml-0 md:ml-64 p-6 transition-all duration-300">
          {/* PAGE HEADER / TOOLS */}
          <header className="flex justify-end mb-4">
            {/* <UserMenu /> */}
          </header>

          {/* PAGE CONTENT */}
          {children}
        </main>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
