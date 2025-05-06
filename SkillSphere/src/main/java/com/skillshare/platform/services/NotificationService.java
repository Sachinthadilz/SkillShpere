package com.skillshare.platform.services;

import com.skillshare.platform.models.Notification;
import com.skillshare.platform.models.User;

import java.util.List;

public interface NotificationService {
    Notification createNotification(User receiver, User sender, String message, Notification.NotificationType type);
    List<Notification> getNotificationsForUser(Long userId);
    void markNotificationAsRead(Long notificationId);
    void markAllNotificationsAsRead(Long userId);
    long getUnreadNotificationCount(Long userId);
}