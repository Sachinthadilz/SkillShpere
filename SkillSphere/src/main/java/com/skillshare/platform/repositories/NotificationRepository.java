package com.skillshare.platform.repositories;

import com.skillshare.platform.models.Notification;
import com.skillshare.platform.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReceiverOrderByCreatedAtDesc(User receiver);
    long countByReceiverAndIsReadFalse(User receiver);
}