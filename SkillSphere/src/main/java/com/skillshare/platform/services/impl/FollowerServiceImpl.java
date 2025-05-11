// FollowerServiceImpl.java
package com.skillshare.platform.services.impl;

import com.skillshare.platform.models.Follower;
import com.skillshare.platform.models.User;

import com.skillshare.platform.repositories.FollowerRepository;
import com.skillshare.platform.repositories.UserRepository;
import com.skillshare.platform.services.FollowerService;
import com.skillshare.platform.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FollowerServiceImpl implements FollowerService {

    @Autowired
    private FollowerRepository followerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService; // Assuming this exists

    @Override
    @Transactional
    public Follower followUser(Long userId, Long followerUserId) {
        if (userId.equals(followerUserId)) {
            throw new IllegalArgumentException("Users cannot follow themselves");
        }

        // Validate users exist via UserService
        userService.getUserById(userId); // Assuming this throws if not found
        userService.getUserById(followerUserId);

        // Fetch User entities for JPA
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        User followerUser = userRepository.findById(followerUserId)
            .orElseThrow(() -> new RuntimeException("Follower user not found"));

        if (followerRepository.existsByUserAndFollowerUser(user, followerUser)) {
            throw new IllegalStateException("Already following this user");
        }

        Follower follower = new Follower();
        follower.setUser(user);
        follower.setFollowerUser(followerUser);

        return followerRepository.save(follower);
    }

    @Override
    @Transactional
    public void unfollowUser(Long userId, Long followerUserId) {
        // Validate users exist
        userService.getUserById(userId);
        userService.getUserById(followerUserId);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        User followerUser = userRepository.findById(followerUserId)
            .orElseThrow(() -> new RuntimeException("Follower user not found"));

        if (!followerRepository.existsByUserAndFollowerUser(user, followerUser)) {
            throw new IllegalStateException("Not following this user");
        }

        followerRepository.deleteByUserAndFollowerUser(user, followerUser);
    }

    @Override
    public List<Follower> getFollowers(Long userId) {
        userService.getUserById(userId); // Validate user exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return followerRepository.findByUser(user);
    }

    @Override
    public List<Follower> getFollowing(Long userId) {
        userService.getUserById(userId); // Validate user exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return followerRepository.findByFollowerUser(user);
    }
}