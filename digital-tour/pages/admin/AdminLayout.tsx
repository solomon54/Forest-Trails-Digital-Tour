// pages/admin/AdminLayout.tsx
import React from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/"  className="font-bold text-emerald-600">ForestTrail</Link>
          <nav className="flex gap-4">
            <Link href="/admin"  className="text-sm">Dashboard</Link>
            <Link href="/admin/Listings"  className="text-sm">Listings</Link>
            <Link href="/admin/resources"  className="text-sm">Resources</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
