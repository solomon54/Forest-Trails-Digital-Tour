// components/navbar/Navbar.tsx
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import UserMenu from "../users/UserProfile";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthorizedAdmin } = useAuth();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    if (href === "/admin") return pathname.startsWith("/admin");
    return pathname.startsWith(href);
  };

  const guestLinks = [
    { label: "Home", href: "/" },
    { label: "Tours", href: "/tours" },
    { label: "Login", href: "/Login" },
    { label: "Signup", href: "/Signup" },
  ];

  const loggedInLinks = [
    { label: "Home", href: "/" },
    { label: "Tours", href: "/tours" },
    { label: "Upload Sites", href: "/uploads" },
    ...(isAuthorizedAdmin ? [{ label: "Admin Panel", href: "/admin" }] : []),
  ];

  const baseLinks = user ? loggedInLinks : guestLinks;
  const visibleLinks = baseLinks.filter((link) => !isActive(link.href));

  return (
    <nav className="bg-linear-to-l from-indigo-600 to-violet-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: Logo + Mobile Hamburger */}
          <div className="flex items-center">
            <div className="md:hidden mr-4">
              <button
                onClick={toggleMenu}
                className="text-white text-3xl focus:outline-none"
                aria-label="Toggle menu">
                {isOpen ? <HiX /> : <HiMenu />}
              </button>
            </div>

            <Link href="/">
              <span className="text-white font-bold text-2xl cursor-pointer hover:text-emerald-200 transition">
                FOREST<span className="text-emerald-400">•</span>TRAILS
              </span>
            </Link>
          </div>

          {/* Right side: Links and Account Actions */}
          <div className="flex items-center">
            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-2">
              {visibleLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      isActive(link.href)
                        ? "bg-white/30 text-white font-bold"
                        : "text-white hover:bg-white/20"
                    }`}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Account Actions Section (Notifications + Profile) */}
            {user && (
              /* Added ml-4 sm:ml-6 to separate from links.
                 Added border-l and pl-4/pl-6 to create a visual vertical divider.
              */
              <div className="flex items-center ml-4 sm:ml-6 pl-4 sm:pl-6 border-l border-white/20">
                <UserMenu />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white shadow-xl border-t">
          <div className="px-6 pt-5 pb-8 space-y-4">
            {visibleLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  onClick={() => setIsOpen(false)}
                  className={`block text-lg font-medium py-3 px-4 rounded-md transition ${
                    isActive(link.href)
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
