"use client"
import { useEffect, useState } from "react";
import { getLatestNotifications, readAllNotifications, readNotification } from "~/server/db/queries/notifications";
import { SelectNotification } from "~/server/db/schemaTypes";
import { useAuth } from "@clerk/nextjs";

export const useNotificationPolling = () => {
    const [notifications, setNotifications] = useState<SelectNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { orgRole, orgId, userId, isLoaded } = useAuth();

    useEffect(() => {
        if (!orgRole || !orgId || !userId || !isLoaded) return;

        let isMounted = true;

        const fetchNotifications = async () => {
            try {
                const latestNotifications = await getLatestNotifications(userId, orgRole, orgId);
                
                if (isMounted) {
                    setNotifications(latestNotifications ?? []);
                    setUnreadCount(latestNotifications?.filter(n => !n.isRead)?.length ?? 0);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications(); // Fetch immediately
        const interval = setInterval(fetchNotifications, 10000); // Poll every 5s

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [orgRole, orgId, userId, isLoaded]);

    const markAllAsRead = async () => {
        try {
            if (!orgRole || !orgId || !userId) return;
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            await readAllNotifications(userId, orgRole, orgId);
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    }

    const markAsRead = async (notificationId: string) => {
        try {
            if (!orgRole || !orgId || !userId) return;
            setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
            setUnreadCount(prev => prev - 1);
            await readNotification(notificationId);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    }

    return { notifications, unreadCount, setNotifications, setUnreadCount, markAllAsRead, markAsRead };
};
