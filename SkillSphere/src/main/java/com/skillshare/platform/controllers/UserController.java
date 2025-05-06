package com.skillshare.platform.controllers;

import com.skillshare.platform.models.Follower;
import com.skillshare.platform.models.User;
import com.skillshare.platform.repositories.UserRepository;
import com.skillshare.platform.security.response.MessageResponse;
import com.skillshare.platform.security.response.UserInfoResponse;
import com.skillshare.platform.security.services.UserDetailsImpl;
import com.skillshare.platform.services.FollowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth/user")
public class UserController {
    @Autowired
    private FollowerService followerService;

    @Autowired
    private UserRepository userRepository;


    @GetMapping({"/followers/{userId}"})
    public ResponseEntity<?> getFollowers(
            @PathVariable(required = false) Long userId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("User must be authenticated to view followers"));
        }

        // Use provided userId or default to authenticated user's ID
        Long targetUserId = userId != null ? userId : userDetails.getId();

        try {
            List<Follower> followers = followerService.getFollowers(targetUserId);
            List<UserInfoResponse> followerDetails = followers.stream()
                    .map(f -> {
                        User user = f.getFollowerUser();
                        UserInfoResponse response = new UserInfoResponse(
                                user.getUserId(),
                                user.getUserName(),
                                user.getEmail(),
                                user.isAccountNonLocked(),
                                user.isAccountNonExpired(),
                                user.isCredentialsNonExpired(),
                                user.isEnabled(),
                                user.getCredentialsExpiryDate(),
                                user.getAccountExpiryDate(),
                                user.isTwoFactorEnabled(),
                                List.of(user.getRole().getRoleName().name()),
                                user.getBio(),
                                user.getProfilePicture()
                        );

                        // Check if authenticated user follows this follower
                        User currentUser = userRepository.findById(userDetails.getId()).orElse(null);
                        if (currentUser != null) {
                            boolean isFollowed = followerService.getFollowing(userDetails.getId()).stream()
                                    .anyMatch(following -> following.getUser().getUserId().equals(user.getUserId()));
                            response.setFollowed(isFollowed);
                        }

                        return response;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(followerDetails);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("User not found"));
        }
    }

    @GetMapping({"/following/{userId}"})
    public ResponseEntity<?> getFollowing(
            @PathVariable(required = false) Long userId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("User must be authenticated to view following"));
        }

        // Use provided userId or default to authenticated user's ID
        Long targetUserId = userId != null ? userId : userDetails.getId();

        try {
            List<Follower> followingList = followerService.getFollowing(targetUserId); // Renamed variable
            List<UserInfoResponse> followingDetails = followingList.stream()
                    .map(f -> {
                        User user = f.getUser();
                        UserInfoResponse response = new UserInfoResponse(
                                user.getUserId(),
                                user.getUserName(),
                                user.getEmail(),
                                user.isAccountNonLocked(),
                                user.isAccountNonExpired(),
                                user.isCredentialsNonExpired(),
                                user.isEnabled(),
                                user.getCredentialsExpiryDate(),
                                user.getAccountExpiryDate(),
                                user.isTwoFactorEnabled(),
                                List.of(user.getRole().getRoleName().name()),
                                user.getBio(),
                                user.getProfilePicture()
                        );

                        // Check if authenticated user follows this user
                        User currentUser = userRepository.findById(userDetails.getId()).orElse(null);
                        if (currentUser != null) {
                            boolean isFollowed = followerService.getFollowing(userDetails.getId()).stream()
                                    .anyMatch(following -> following.getUser().getUserId().equals(user.getUserId()));
                            response.setFollowed(isFollowed);
                        }

                        return response;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(followingDetails);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("User not found"));
        }
    }

}
