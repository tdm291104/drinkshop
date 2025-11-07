import { Notification } from "@/types/notification.types";
import Link from "next/link";

interface NotificationItemProps {
  n: Notification;
}

const NotificationItem = ({ n }: NotificationItemProps) => {
  const content = (
    <>
      <p
        className={`text-sm text-secondary-foreground ${
          n.isSeen ? "font-medium" : "font-bold"
        }`}
      >
        {n.title}
      </p>
      <p className="text-sm text-muted-foreground">{n.message}</p>
      <p className="text-xs text-gray-400 mt-1">
        {new Date(n.createdAt).toLocaleString("vi-VN")}
      </p>
    </>
  );

  return n.link ? (
    <Link
      href={n.link}
      className={`${
        n.isSeen ? "bg-white" : "bg-muted"
      } block px-4 py-3 border-b last:border-0 hover:bg-accent/50 transition-colors last:rounded-b-xl`}
    >
      {content}
    </Link>
  ) : (
    <div
      className={`${
        n.isSeen ? "bg-white" : "bg-muted"
      } px-4 py-3 border-b last:border-0 hover:bg-accent/50 transition-colors last:rounded-b-xl`}
    >
      {content}
    </div>
  );
};

export default NotificationItem;
