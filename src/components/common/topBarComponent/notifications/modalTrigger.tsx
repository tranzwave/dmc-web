import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { useNotificationPolling } from "./useNotifications";
import NotificationItem from "./notificationItem";

const NotificationModalTrigger: React.FC = () => {
    const { notifications, unreadCount, setNotifications, setUnreadCount, markAllAsRead } = useNotificationPolling();
    const [open, setOpen] = useState(false);



    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="relative cursor-pointer">
                    <Bell size={20} color="#697077" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 text-xs px-1 bg-primary-orange">{unreadCount}</Badge>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-96">
                <div className="flex justify-between items-center">
                    <h3 className="text-[15px] font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                        <button className="text-primary-green text-[13px]" onClick={markAllAsRead}>
                            Mark all as read
                        </button>
                    )}
                </div>
                <div className="mt-2 flex flex-col gap-2">
                    {notifications.length === 0 ? (
                        <li className="text-gray-500 text-center">No notifications</li>
                    ) : (
                        notifications.map((notification, index) => (
                            <NotificationItem key={index} notification={notification} onClick={() => {
                                setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
                                setUnreadCount(prev => prev - 1);
                                setOpen(false);
                            }
                            } />
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationModalTrigger;
