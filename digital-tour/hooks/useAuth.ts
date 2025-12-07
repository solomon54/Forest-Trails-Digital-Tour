// hooks/useAuth.ts
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setUser(data.user);
            setIsAdmin(data.user?.role === "admin");
          }
        } else {
          if (isMounted) {
            setUser(null);
            setIsAdmin(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) setLoading(false); // ← THIS fixes the loop
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, loading, isAdmin };
};
