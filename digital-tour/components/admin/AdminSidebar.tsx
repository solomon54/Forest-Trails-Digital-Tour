import Link from "next/link";
import { useRouter } from "next/router";

const menuItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Users", path: "/admin/users" },
  { label: "Bookings", path: "/admin/bookings" },
  { label: "Properties", path: "/admin/properties" },
  { label: "Reviews", path: "/admin/reviews" },
  { label: "Resources", path: "/admin/resources" },
];

export default function AdminSidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  return (
    <>
      {/* BACKDROP */}
      {/* Only visible on mobile when sidebar is open */}
      <div
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-sm z-40
          transition-opacity duration-300 md:hidden
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setOpen(false)}
      />

      {/* SIDEBAR PANEL */}
      <aside
        className={`
          h-screen bg-blend-soft-light text-gray-600 shadow-lg flex flex-col p-4 w-64
          fixed md:relative top-0 left-0 z-50
          transition-transform duration-300 ease-in-out

          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden mb-4 text-xl self-end"
        >
          ✖
        </button>

        {/* MENU */}
        <nav className="flex flex-col gap-2 mt-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setOpen(false)} // auto close on mobile
              className={`px-4 py-2 rounded-lg  font-medium transition
                ${
                  isActive(item.path)
                    ? "bg-blue-600 text-gray-200 shadow"
                    : "hover:bg-blue-200"
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
