package com.skillshare.platform.services;

import com.skillshare.platform.dtos.UserDTO;
import com.skillshare.platform.models.Role;
import com.skillshare.platform.models.User;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface UserService {
    void updateUserRole(Long userId, String roleName);

    List<User> getAllUsers();

    UserDTO getUserById(Long id);

    User findByUsername(String username);

    void updateAccountLockStatus(Long userId, boolean lock);

    List<Role> getAllRoles();

    void updateAccountExpiryStatus(Long userId, boolean expire);

    void updateAccountEnabledStatus(Long userId, boolean enabled);

    void updateCredentialsExpiryStatus(Long userId, boolean expire);

    void updatePassword(Long userId, String password);

    void genaratePasswordResetToken(String email);

    void resetPassword(String token, String newPassword);

    Optional<User> findByEmail(String email);

    User registerUser(User user);

    GoogleAuthenticatorKey generate2FASecret(Long userId);

    boolean validate2FACode(Long userId, int code);

    void  enable2FA(Long userId);

    void  disable2FA(Long userId);

    Optional<User> findById(Long userId);

    UserDTO getPublicProfile(Long userId, Long authenticatedUserId);

    List<UserDTO> getAllPublicProfiles(Long authenticatedUserId);

    void updateProfileInfo(Long userId, String bio, MultipartFile profilePicture) throws IOException;

}
