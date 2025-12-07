import { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import UserMenu from "../common/UserMenu";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // 🔥 get logged user

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Tours", href: "/tours" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "AdminPanel", href: "/admin" },
  ];

  return (
    <nav className="bg-linear-to-l from-indigo-300 to-violet-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-emerald-100 font-bold text-2xl cursor-pointer">
                TravelX
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-3 items-center">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="text-gray-100 hover:bg-emerald-600 font-medium cursor-pointer rounded-md px-2 py-1.5">
                  {link.label}
                </span>
              </Link>
            ))}

            {/* If NOT logged in */}
            {!user && (
              <>
                <Link href="/Login">
                  <button className="px-5 py-2 bg-emerald-600 text-gray-200 rounded-xl hover:bg-emerald-500 transition">
                    Login
                  </button>
                </Link>
                <Link href="/Signup">
                  <button className="px-5 py-2 border border-emerald-600 text-gray-200 rounded-xl hover:bg-emerald-500 transition">
                    Signup
                  </button>
                </Link>
              </>
            )}

            {/* If logged in → show menu */}
            {user && <UserMenu />}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-2xl text-slate-700">
              {isOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 pt-4 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  onClick={() => setIsOpen(false)}
                  className="block text-slate-700 hover:text-emerald-600 font-medium cursor-pointer"
                >
                  {link.label}
                </span>
              </Link>
            ))}

            {!user && (
              <>
                <Link href="/Login">
                  <span
                    onClick={() => setIsOpen(false)}
                    className="block px-5 py-2 bg-emerald-600 text-white rounded-xl text-center"
                  >
                    Login
                  </span>
                </Link>
                <Link href="/Signup">
                  <span
                    onClick={() => setIsOpen(false)}
                    className="block px-5 py-2 border border-emerald-600 text-emerald-600 rounded-xl text-center"
                  >
                    Signup
                  </span>
                </Link>
              </>
            )}

            {user && <UserMenu />}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
