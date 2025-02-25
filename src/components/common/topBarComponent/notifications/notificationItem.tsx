import React from "react";
import { CheckCircle, Circle } from "lucide-react";
import { SelectNotification } from "~/server/db/schemaTypes";
import { formatDistanceToNow } from "date-fns";

interface NotificationItemProps {
    notification: SelectNotification;
    onClick: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
    return (
        <div
            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${
                notification.isRead ? "bg-gray-100" : "bg-green-50"
            } hover:bg-gray-200 transition`}
            onClick={onClick}
        >
            {/* {notification.isRead ? <CheckCircle size={18} className="text-gray-400" /> : <Circle size={18} className="text-blue-500" />} */}
            <div className="">
                <div className={`text-[15px] ${notification.isRead ? "text-gray-700" : "font-semibold text-black"}`}>{notification.title}</div>
                <p className="text-gray-500 text-[13px]">{notification.message}</p>
                {notification.createdAt && (
                    <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                )}
            </div>
        </div>
    );
};

export default NotificationItem;
