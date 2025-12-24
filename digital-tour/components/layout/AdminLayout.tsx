// components/layout/AdminLayout.tsx
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
       
        <AdminSidebar />  

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 pl-20 md:pl-20">
            
            {children}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}