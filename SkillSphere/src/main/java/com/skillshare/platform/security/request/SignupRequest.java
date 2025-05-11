// SignupRequest.java
package com.skillshare.platform.security.request;

import java.util.Set;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @Setter
    @Getter
    private Set<String> role;

    @Size(max = 255)
    private String profilePicture;

    @Size(max = 160)
    private String bio;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
}