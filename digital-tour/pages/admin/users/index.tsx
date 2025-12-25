// pages/admin/users/index.tsx  
import { useEffect, useState } from "react";
import UserList from "@/components/admin/users/UserList";
import AdminRole from "@/components/admin/users/AdminRole";
import AdminLayout from "@/components/layout/AdminLayout";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  is_super_admin: boolean;
  photo_url?: string | null;
  created_at: string;
  updated_at?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeRevokeUserId, setActiveRevokeUserId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      const usersRes = await fetch("/api/admin/users");
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData);
      }
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchCurrentUser()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // New: Full refresh function
  const refreshUsers = async () => {
    setLoading(true); // optional: show spinner again briefly
    await fetchUsers();
    setLoading(false);
  };

  const handleUpdate = (updated: AdminUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? updated : u))
    );
  };

 

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-lg text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Unable to authenticate current user.</p>
      </div>
    );
  }

  return (
    <AdminLayout>
      <UserList
        users={users}
        renderActions={(user) => (
          <AdminRole
            user={user}
            currentUserId={currentUser.id}
            currentUserIsSuperAdmin={currentUser.is_super_admin}
            activeRevokeUserId={activeRevokeUserId}
            setActiveRevokeUserId={setActiveRevokeUserId}
            // Change this line:
            onUpdated={handleUpdate} // ← now refreshes from server
          />
        )}
      />
    </AdminLayout>
  );
}