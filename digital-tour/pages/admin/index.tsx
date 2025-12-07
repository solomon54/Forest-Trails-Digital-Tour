// pages/admin/index.tsx

import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

useEffect(() => {
  if (!loading) {
    if (!user) {
      router.replace(`/Login?redirect=${router.asPath}`);
      return;
    }
    if (!isAdmin) {
      router.replace('/');
      return;
    }
  }
}, [loading, user, isAdmin, router]);

  if (loading) return <p>Loading...</p>;

  if (!user) return null;  // while redirecting, render nothing

  if (!isAdmin) return <p>Access denied.</p>;

  return (
    <div>
      <h1>Welcome Admin {user.name} ✨</h1>
    </div>
  );
}

