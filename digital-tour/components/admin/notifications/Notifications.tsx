//components/admin/notifications/Notifications.tsx
export default function NotificationItem({ n }: any) {
  return (
    <div className={`notification ${n.is_read ? "read" : "unread"}`}>
      <h4>{n.title}</h4>
      <p>{n.message}</p>
      <small>{new Date(n.created_at).toLocaleString()}</small>
    </div>
  );
}
