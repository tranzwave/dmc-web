import React from "react";
import { CalendarRange, CheckCircle, Circle } from "lucide-react";
import { SelectNotification } from "~/server/db/schemaTypes";
import { formatDistanceToNow } from "date-fns";
import { Bell, ArrowRight } from "lucide-react"
import { Card, CardContent } from "~/components/ui/card"
import { Button } from "~/components/ui/button"

interface NotificationItemProps {
    notification: SelectNotification;
    onClick: () => void;
}

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const handleViewDetails = () => {
    // Implement navigation logic here
    console.log("Navigating to notification details")
  }

  console.log(notification)

  return (
    <Card className={`w-full max-w-sm bg-white shadow-md ${!notification.isRead ? 'border border-primary-green' : ''} hover:bg-primary-green/5 hover:cursor-pointer`}>
      <CardContent className="p-3">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {notification.title.toLowerCase().includes('booking') ? (
                <CalendarRange className="h-6 w-6 text-primary-green" />
            ):(
                <Bell className="h-6 w-6 text-primary-green" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
            <p className="text-[13px] leading-[17px] text-gray-500 mt-1">
              {notification.message}
            </p>
            <div className="flex justify-between items-center mt-1">
            {notification.createdAt && (
                <p className="text-[13px] text-primary-green">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</p>
            )}
            {notification.pathname && notification.pathname !== "none" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClick}
                className="text-[13px] text-primary-green hover:text-[#1E6054] hover:bg-[#E6F3F1]"
              >
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
