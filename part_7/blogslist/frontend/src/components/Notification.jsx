import { useNotificationValue } from "../notificationContext";

const Notification = () => {
  const notification = useNotificationValue();
  if (!notification || !notification.message) return null;

  return <div style={{ color: notification.color }}>{notification.message}</div>;
};

export default Notification;
