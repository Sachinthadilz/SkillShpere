package com.skillshare.platform.controllers;

import com.skillshare.platform.dtos.UserDTO;
import com.skillshare.platform.models.*;
import com.skillshare.platform.repositories.RoleRepository;
import com.skillshare.platform.repositories.UserRepository;
import com.skillshare.platform.security.jwt.JwtUtils;
import com.skillshare.platform.security.request.LoginRequest;
import com.skillshare.platform.security.request.SignupRequest;
import com.skillshare.platform.security.response.LoginResponse;
import com.skillshare.platform.security.response.MessageResponse;
import com.skillshare.platform.security.response.UserInfoResponse;
import com.skillshare.platform.security.services.UserDetailsImpl;
import com.skillshare.platform.services.NotificationService;
import com.skillshare.platform.services.TotpService;
import com.skillshare.platform.services.UserService;
import com.skillshare.platform.services.FollowerService;
import com.skillshare.platform.util.AuthUtil;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    UserService userService;

    @Autowired
    FollowerService followerService;

    @Autowired
    AuthUtil authUtil;

    @Autowired
    TotpService totpService;

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/public/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication;
        try {
            authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (AuthenticationException exception) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Bad credentials");
            map.put("status", false);
            return new ResponseEntity<Object>(map, HttpStatus.NOT_FOUND);
        }

//      set the authentication
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);

        // Collect roles from the UserDetails
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // Prepare the response body, now including the JWT token directly in the body
        LoginResponse response = new LoginResponse(userDetails.getUsername(), roles, jwtToken);

        // Return the response entity with the JWT token included in the response body
        return ResponseEntity.ok(response);
    }

    @PostMapping("/public/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUserName(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Role role;

        if (strRoles == null || strRoles.isEmpty()) {
            role = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        } else {
            String roleStr = strRoles.iterator().next();
            if (roleStr.equals("admin")) {
                role = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            } else {
                role = roleRepository.findByRoleName(AppRole.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            }

            user.setBio(signUpRequest.getBio() != null ? signUpRequest.getBio() : null);
            user.setProfilePicture(signUpRequest.getProfilePicture() != null ? signUpRequest.getProfilePicture() : null);

            user.setAccountNonLocked(true);
            user.setAccountNonExpired(true);
            user.setCredentialsNonExpired(true);
            user.setEnabled(true);
            user.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
            user.setAccountExpiryDate(LocalDate.now().plusYears(1));
            user.setTwoFactorEnabled(false);
            user.setSignUpMethod("email");
        }
        user.setRole(role);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }


    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

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
                roles,
                user.getBio(),
                user.getProfilePicture()
        );

        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/username")
    public String currentUserName(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return (userDetails != null) ? userDetails.getUsername() : "";
    }


    @PostMapping("/public/forgot-password")
    public  ResponseEntity<?> forgotPassword(@RequestParam String email){
        try{
            userService.genaratePasswordResetToken(email);
            return ResponseEntity.ok(new MessageResponse("Password reset email sent!"));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error Sending password reset email"));
        }
    }

    @PostMapping("/public/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token,
                                           @RequestParam String newPassword) {
        try {
            userService.resetPassword(token, newPassword);
            return ResponseEntity.ok(new MessageResponse("Password reset successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    // 2FA Authentication
    @PostMapping("/enable-2fa")
    public ResponseEntity<String> enable2FA() {
        Long userId = authUtil.loggedInUserId();
        GoogleAuthenticatorKey secret = userService.generate2FASecret(userId);
        String qrCodeUrl = totpService.getQrCodeUrl(secret,
                userService.getUserById(userId).getUserName());
        return ResponseEntity.ok(qrCodeUrl);
    }

    @PostMapping("/disable-2fa")
    public ResponseEntity<String> disable2FA() {
        Long userId = authUtil.loggedInUserId();
        userService.disable2FA(userId);
        return ResponseEntity.ok("2FA disabled");
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<String> verify2FA(@RequestParam int code) {
        Long userId = authUtil.loggedInUserId();
        boolean isValid = userService.validate2FACode(userId, code);
        if (isValid) {
            userService.enable2FA(userId);
            return ResponseEntity.ok("2FA Verified");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid 2FA Code");
        }
    }

    @GetMapping("/user/2fa-status")
    public ResponseEntity<?> get2FAStatus() {
        User user = authUtil.loggedInUser();
        if (user != null){
            return ResponseEntity.ok().body(Map.of("is2faEnabled", user.isTwoFactorEnabled()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }
    }

    @PostMapping("/public/verify-2fa-login")
    public ResponseEntity<String> verify2FALogin(@RequestParam int code,
                                                 @RequestParam String jwtToken) {
        String username = jwtUtils.getUserNameFromJwtToken(jwtToken);
        User user = userService.findByUsername(username);
        boolean isValid = userService.validate2FACode(user.getUserId(), code);
        if (isValid) {
            return ResponseEntity.ok("2FA Verified");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid 2FA Code");
        }
    }

    @PostMapping("/follow/{userId}")
    public ResponseEntity<?> followUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("User must be authenticated to follow"));
        }
        Long followerUserId = userDetails.getId(); // Assuming UserDetailsImpl has getId()
        try {
            Follower follower = followerService.followUser(userId, followerUserId);
            return ResponseEntity.ok(new MessageResponse("Successfully followed user with ID: " + userId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("User not found"));
        }
    }

    @PostMapping("/unfollow/{userId}")
    public ResponseEntity<?> unfollowUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("User must be authenticated to unfollow"));
        }
        Long followerUserId = userDetails.getId();
        try {
            followerService.unfollowUser(userId, followerUserId);
            return ResponseEntity.ok(new MessageResponse("Successfully unfollowed user with ID: " + userId));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("User not found"));
        }
    }

//    @GetMapping("/followers")
//    public ResponseEntity<?> getFollowers(@AuthenticationPrincipal UserDetailsImpl userDetails) {
//        if (userDetails == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(new MessageResponse("User must be authenticated to view followers"));
//        }
//
//        Long userId = userDetails.getId();
//        try {
//            List<Follower> followers = followerService.getFollowers(userId);
//            List<UserInfoResponse> followerDetails = followers.stream()
//                    .map(f -> {
//                        User user = f.getFollowerUser();
//                        return new UserInfoResponse(
//                                user.getUserId(),
//                                user.getUserName(),
//                                user.getEmail(),
//                                user.isAccountNonLocked(),
//                                user.isAccountNonExpired(),
//                                user.isCredentialsNonExpired(),
//                                user.isEnabled(),
//                                user.getCredentialsExpiryDate(),
//                                user.getAccountExpiryDate(),
//                                user.isTwoFactorEnabled(),
//                                List.of(user.getRole().getRoleName().name()),
//                                user.getBio(),
//                                user.getProfilePicture()
//                        );
//                    })
//                    .collect(Collectors.toList());
//            return ResponseEntity.ok(followerDetails);
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(new MessageResponse("User not found"));
//        }
//    }
//
//    @GetMapping("/following")
//    public ResponseEntity<?> getFollowing(@AuthenticationPrincipal UserDetailsImpl userDetails) {
//        if (userDetails == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(new MessageResponse("User must be authenticated to view following"));
//        }
//
//        Long userId = userDetails.getId();
//        try {
//            List<Follower> following = followerService.getFollowing(userId);
//            List<UserInfoResponse> followingDetails = following.stream()
//                    .map(f -> {
//                        User user = f.getUser();
//                        return new UserInfoResponse(
//                                user.getUserId(),
//                                user.getUserName(),
//                                user.getEmail(),
//                                user.isAccountNonLocked(),
//                                user.isAccountNonExpired(),
//                                user.isCredentialsNonExpired(),
//                                user.isEnabled(),
//                                user.getCredentialsExpiryDate(),
//                                user.getAccountExpiryDate(),
//                                user.isTwoFactorEnabled(),
//                                List.of(user.getRole().getRoleName().name()),
//                                user.getBio(),
//                                user.getProfilePicture()
//                        );
//                    })
//                    .collect(Collectors.toList());
//            return ResponseEntity.ok(followingDetails);
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(new MessageResponse("User not found"));
//        }
//    }

    @GetMapping({"/followers", "/followers/{userId}"})
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

    @GetMapping({"/following", "/following/{userId}"})
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

    @GetMapping("/profiles")
    public ResponseEntity<?> getAllPublicProfiles(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("User must be authenticated to view profiles"));
        }
        Long authenticatedUserId = userDetails.getId();
        List<UserDTO> profiles = userService.getAllPublicProfiles(authenticatedUserId);
        return ResponseEntity.ok(profiles);
    }

    // Updated single profile endpoint: Removed /public/ and added authentication check
    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getPublicProfile(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("User must be authenticated to view profiles"));
        }
        try {
            Long authenticatedUserId = userDetails.getId();
            UserDTO profile = userService.getPublicProfile(userId, authenticatedUserId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("User not found"));
        }
    }

//    @PostMapping("/profile/update")
//    public ResponseEntity<?> updateProfile(
//            @RequestParam(required = false) String bio,
//            @RequestParam(required = false) MultipartFile profilePicture,
//            @AuthenticationPrincipal UserDetailsImpl userDetails) {
//
//        if (userDetails == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(new MessageResponse("User must be authenticated"));
//        }
//
//        try {
//            Long userId = userDetails.getId();
//            userService.updateProfileInfo(userId, bio, profilePicture);
//            return ResponseEntity.ok(new MessageResponse("Profile updated successfully"));
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(new MessageResponse("Failed to update profile: " + e.getMessage()));
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
//        }
//    }

    @PostMapping("/profile/update")
    public ResponseEntity<?> updateProfile(
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) MultipartFile profilePicture,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("User must be authenticated"));
        }

        try {
            Long userId = userDetails.getId();
            userService.updateProfileInfo(userId, bio, profilePicture);

            // Two options to fix the error:

            // OPTION 1: Get the User object directly from repository instead of service
            User updatedUser = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // OPTION 2: If you need to use the service method, adjust your response code:
            // UserDTO updatedUser = userService.getUserById(userId);

            // Return only the relevant profile information
            Map<String, Object> profileData = new HashMap<>();
            profileData.put("id", updatedUser.getUserId());
            profileData.put("username", updatedUser.getUserName());
            profileData.put("bio", updatedUser.getBio());
            profileData.put("profilePicture", updatedUser.getProfilePicture());
            profileData.put("role", updatedUser.getRole().getRoleName().name());

            return ResponseEntity.ok(profileData);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Failed to update profile: " + e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/notifications")
    public ResponseEntity<?> getUserNotifications(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("User must be authenticated"));
        }

        try {
            // Get notifications from service
            List<Notification> notifications = notificationService.getNotificationsForUser(userDetails.getId());

            // Convert to simple maps to avoid serialization issues
            List<Map<String, Object>> notificationData = notifications.stream()
                    .map(n -> {
                        Map<String, Object> data = new HashMap<>();
                        data.put("id", n.getId());
                        data.put("message", n.getMessage());
                        data.put("isRead", n.isRead());
                        data.put("createdAt", n.getCreatedAt());
                        data.put("type", n.getType());

                        // Only include essential sender information to avoid circular references
                        if (n.getSender() != null) {
                            Map<String, Object> sender = new HashMap<>();
                            sender.put("id", n.getSender().getUserId());
                            sender.put("username", n.getSender().getUserName());
                            data.put("sender", sender);
                        }

                        return data;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(notificationData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error retrieving notifications: " + e.getMessage()));
        }
    }

    @GetMapping("/notifications/count")
    public ResponseEntity<?> getUnreadNotificationCount(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("User must be authenticated"));
        }

        long count = notificationService.getUnreadNotificationCount(userDetails.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/notifications/{notificationId}/read")
    public ResponseEntity<?> markNotificationAsRead(
            @PathVariable Long notificationId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("User must be authenticated"));
        }

        try {
            notificationService.markNotificationAsRead(notificationId);
            return ResponseEntity.ok(new MessageResponse("Notification marked as read"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/notifications/read-all")
    public ResponseEntity<?> markAllNotificationsAsRead(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("User must be authenticated"));
        }

        notificationService.markAllNotificationsAsRead(userDetails.getId());
        return ResponseEntity.ok(new MessageResponse("All notifications marked as read"));
    }


}
