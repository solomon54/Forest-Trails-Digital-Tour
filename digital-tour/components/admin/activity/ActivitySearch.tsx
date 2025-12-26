import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

interface Props {
  onSearch: (value: string) => void;
}

export default function ActivitySearch({ onSearch }: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      onSearch(value.trim());
    }, 500);
    return () => clearTimeout(id);
  }, [value, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg mx-auto gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search admin, action, reason…"
        // FIXED: Classes are now a single string without literal newlines
        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 transition"
      />
      <button
        type="submit"
        // FIXED: Classes are now a single string
        className="px-4 py-3 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 active:scale-105 cursor-pointer transition flex items-center justify-center shrink-0"
      >
        <FaSearch className="w-4 h-4" />
      </button>
    </form>
  );
}