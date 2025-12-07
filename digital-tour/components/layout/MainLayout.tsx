//layuout/MainLayout.tsx
import Link from "next/link";
import UserMenu from "@/components/common/UserMenu";
import Navbar from "../navbar/Navbar";
import Footer from "./Footer";

export default function MainLayout({ children }) {
  return (
  <>    
  <Navbar />
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="font-bold text-xl mb-6">Admin Panel</h2>

        <nav className="space-y-3">
          <Link href="/admin" className="block text-gray-700 hover:text-black">Dashboard</Link>
          <a href="/admin/users" className="block text-gray-700 hover:text-black">Users</a>
          <a href="/admin/properties" className="block text-gray-700 hover:text-black">Properties</a>
        </nav>
      </aside>

      {/* Right side */}
      <div className="flex-1">
        
        {/* Top bar */}
        <header className="flex justify-end p-4 bg-white shadow">
          
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

    </div>

    <Footer />
  </>

  );
}
