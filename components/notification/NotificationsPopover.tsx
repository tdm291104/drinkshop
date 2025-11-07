import { PopoverContent } from "@radix-ui/react-popover";
import NotificationItem from "@/components/notification/NotificationItem";
import { Notification } from "@/types/notification.types";

const NotificationsPopover = ({
  unreadCount,
  notifications,
  loading,
}: {
  unreadCount: number;
  notifications: Notification[];
  loading: boolean;
}) => {
  if (loading) {
    return <div className="p-4 text-sm text-muted-foreground">Đang tải...</div>;
  }
  return (
    <PopoverContent className="w-80 rounded-xl p-0 shadow-lg bg-white mr-4">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h4 className="font-semibold text-sm text-foreground">Thông báo</h4>
        <span className="text-xs text-muted-foreground">{unreadCount} mới</span>
      </div>
      <div className="max-h-64 overflow-y-auto rounded-b-xl">
        {notifications.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            Không có thông báo mới
          </p>
        ) : (
          notifications.map((n) => <NotificationItem key={n.id} n={n} />)
        )}
      </div>
    </PopoverContent>
  );
};

export default NotificationsPopover;
