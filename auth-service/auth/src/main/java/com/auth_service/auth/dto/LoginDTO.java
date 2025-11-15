package com.auth_service.auth.dto;

import lombok.Data;

@Data
public class LoginDTO {
    private String email;
    private String password;
}
