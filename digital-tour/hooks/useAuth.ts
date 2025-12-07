// hooks/useAuth.ts
import { useEffect, useState } from "react";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  photo_url?: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    let mounted = true;
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me");
        if (!mounted) return;
        if (!res.ok) {
          setUser(null);
        } else {
          const json = await res.json();
          setUser(json.user ?? null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchMe();
    return () => { mounted = false; };
  }, []);

  return { user, loading, isAdmin };
}
