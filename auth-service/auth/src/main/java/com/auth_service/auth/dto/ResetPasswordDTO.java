package com.auth_service.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Objects;

public class ResetPasswordDTO {

    @NotBlank(message = "Token is required")
    private String token;

    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String newPassword;

    // Getters
    public String getToken() {
        return token;
    }

    public String getNewPassword() {
        return newPassword;
    }

    // Setters
    public void setToken(String token) {
        this.token = token;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    // toString
    @Override
    public String toString() {
        return "ResetPasswordDTO{" +
                "token='" + token + '\'' +
                ", newPassword='" + newPassword + '\'' +
                '}';
    }

    // equals
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ResetPasswordDTO that = (ResetPasswordDTO) o;
        return Objects.equals(token, that.token) &&
                Objects.equals(newPassword, that.newPassword);
    }

    // hashCode
    @Override
    public int hashCode() {
        return Objects.hash(token, newPassword);
    }
}