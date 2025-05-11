package com.skillshare.platform.services;

import com.skillshare.platform.models.Follower;
import java.util.List;

public interface FollowerService {
    Follower followUser(Long userId, Long followerUserId);
    void unfollowUser(Long userId, Long followerUserId);
    List<Follower> getFollowers(Long userId);
    List<Follower> getFollowing(Long userId);
}
