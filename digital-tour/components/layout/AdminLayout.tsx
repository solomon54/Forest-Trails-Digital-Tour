// components/layout/AdminLayout.tsx
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setSidebarWidth] = useState(256);

  // Listen for window resize to update sidebar width dynamically
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setSidebarWidth(64); // mobile collapsed width
      } else if (w < 1024) {
        // medium screens: interpolate width between 64px → 256px
        const ratio = (w - 768) / (1024 - 768);
        setSidebarWidth(64 + ratio * (256 - 64));
      } else {
        setSidebarWidth(256); // desktop full width
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />

        {/* Main content takes the remaining width minus sidebarWidth */}
        <div
          className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
          // style={{ marginLeft: `${sidebarWidth}px` }}
        >
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 pl-16 md:pl-2">
            {children}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
