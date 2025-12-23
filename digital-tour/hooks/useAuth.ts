// hooks/useAuth.ts   
import { useEffect, useState } from "react";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  is_super_admin: boolean;     
  photo_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isAdmin = user?.role === "admin";
  const isSuperAdmin = user?.is_super_admin ?? false;
  const isAuthorizedAdmin = isAdmin || isSuperAdmin; // ← for accessing admin features/pages

  useEffect(() => {
    let mounted = true;

    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",   // ← critical: sends the HttpOnly cookie
        });

        if (!mounted) return;

        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();   // ← flat object (matches our /api/auth/me)
          setUser(data ?? null);
        }
      } catch (err) {
        console.error("useAuth fetch error:", err);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchMe();

    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading, isAdmin, isSuperAdmin, isAuthorizedAdmin };
}