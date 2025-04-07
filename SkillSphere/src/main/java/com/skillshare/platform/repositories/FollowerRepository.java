package com.skillshare.platform.repositories;

import com.skillshare.platform.models.Follower;
import com.skillshare.platform.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FollowerRepository extends JpaRepository<Follower, Long> {

    List<Follower> findByUser(User user);
    List<Follower> findByFollowerUser(User followerUser);
    boolean existsByUserAndFollowerUser(User user, User followerUser);
    void deleteByUserAndFollowerUser(User user, User followerUser);
}

