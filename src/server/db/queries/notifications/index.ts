"use server"

import { and, arrayContains, eq, inArray } from "drizzle-orm";
import { db } from "../..";
import { notification } from "../../schema";
import { InsertNotification } from "../../schemaTypes";

export const getLatestNotifications = async (userId: string, userRole: string, tenantId: string) => {
    try {
        if(userRole === 'org:admin') {
            const notifications = await db.query.notification.findMany({
                where: eq(notification.tenantId, tenantId),
                orderBy: (notification, { desc }) => [desc(notification.createdAt)],
                limit: 10
            })

            return notifications;
        }
        const notifications = await db.query.notification.findMany({
            where: and (
                eq(notification.tenantId, tenantId),
                eq(notification.targetUser, userId)
            ),
            orderBy: (notification, { desc }) => [desc(notification.createdAt)],
            limit: 10
        })

        return notifications;
    } catch (error) {
        console.error('Error getting notifications:', error);
        throw new Error('Error fetching notifications');
    }
}

export const getAllNotifications = async (userId: string, userRole: string, tenantId: string) => {
    try {
        if(userRole === 'org:admin') {
            const notifications = await db.query.notification.findMany({
                where: eq(notification.tenantId, tenantId)
            })

            return notifications;
        }
        const notifications = await db.query.notification.findMany({
            where: and (
                eq(notification.tenantId, tenantId),
                eq(notification.targetUser, userId)
            )
        })

        return notifications;
    } catch (error) {
        console.error('Error getting notifications:', error);
        throw new Error('Error fetching notifications');
    }
};

export const getNotificationById = async (id: string) => {
    try {
        const notifications = await db.query.notification.findFirst({
            where: eq(notification.id, id)
        });

        return notifications;
    } catch (error) {
        console.error('Error getting notification by id:', error);
        throw new Error('Error fetching notification');
    }
};

export const createNotification = async (notificationData: InsertNotification) => {
    try {
        const insertedNotification = await db.insert(notification).values({
            ...notificationData
        }).returning();

        const newNotification = insertedNotification[0];

        if (!newNotification) {
            throw new Error("Failed to insert notification data");
        }

        return newNotification;
    } catch (error) {
        console.log('Error saving notification:', error);
        return error;
    }
};

export const readNotification = async (id: string) => {
    try {
        const updatedNotification = await db.update(notification).set({
            isRead: true
        }).where(eq(notification.id, id)).returning();

        return updatedNotification;
    } catch (error) {
        console.error('Error reading notification:', error);
        throw new Error('Error reading notification');
    }
}

export const readAllNotifications = async (userId: string, userRole: string, tenantId: string) => {
    try {
        if(userRole === 'org:admin') {
            const updatedNotifications = await db.update(notification).set({
                isRead: true
            }).where(eq(notification.tenantId, tenantId)).returning();

            return updatedNotifications;
        }
        const updatedNotifications = await db.update(notification).set({
            isRead: true
        }).where(and(
            eq(notification.tenantId, tenantId),
            eq(notification.targetUser, userId)
        )).returning();

        return updatedNotifications;
    } catch (error) {
        console.error('Error reading notifications:', error);
        throw new Error('Error reading notifications');
    }
}