// components/admin/AdminSidebar.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiChevronLeft,
  HiChevronRight,
  HiHome,
  HiUsers,
  HiCalendar,
  HiBell,
  HiFolder,
} from "react-icons/hi";

const menuItems = [
  { label: "Dashboard", path: "/admin", icon: HiHome },
  { label: "Users", path: "/admin/users", icon: HiUsers },
  { label: "Bookings", path: "/admin/bookings", icon: HiCalendar },
  { label: "Notifications", path: "#", icon: HiBell },
  { label: "Resources", path: "/admin/resources", icon: HiFolder },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setExpanded(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <aside
      className={`
        flex flex-col
        bg-white shadow-xl
        transition-all duration-300 ease-in-out
        z-30 left-0
        ${isMobile ? "fixed top-16" : "sticky top-0"}
        ${expanded ? "w-56" : "w-14"}
        h-auto
      `}
    >
      {/* Header (scaled down) */}
      <div className="h-14 flex items-center justify-between px-3 bg-linear-to-r from-indigo-600 to-violet-600 shadow-md shrink-0">
        <h2
          className={`text-base font-semibold text-white overflow-hidden transition-all duration-300 ${
            expanded ? "w-36 opacity-100" : "w-0 opacity-0"
          }`}
        >
          Admin Panel
        </h2>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-white text-xl hover:bg-white/20 rounded-md p-1 transition-all shrink-0"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? <HiChevronLeft /> : <HiChevronRight />}
        </button>
      </div>

      {/* Navigation (scaled spacing + text) */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`
                    flex items-center gap-3 px-2.5 py-2 rounded-md
                    text-xs font-medium transition-all
                    ${
                      isActive(item.path)
                        ? "bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                  onClick={() => isMobile && setExpanded(false)}
                >
                  <Icon className="text-lg shrink-0" />

                  <span
                    className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${
                      expanded ? "w-28 opacity-100" : "w-0 opacity-0"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
