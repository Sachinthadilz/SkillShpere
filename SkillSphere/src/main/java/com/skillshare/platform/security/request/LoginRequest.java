package com.skillshare.platform.security.request;

import lombok.Getter;
import lombok.Setter;

// LoginRequest.java
@Setter
@Getter
public class LoginRequest {
    private String username;

    private String password;

}
