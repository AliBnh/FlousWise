package com.auth_service.auth.dto;

import com.auth_service.auth.model.User;

import java.util.Objects;

public class AuthResponseDTO {
    private String accessToken;
    private String refreshToken;
    private User user;

    // Constructor
    public AuthResponseDTO(String accessToken, String refreshToken, User user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }

    // Getters
    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public User getUser() {
        return user;
    }

    // Setters
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // toString
    @Override
    public String toString() {
        return "AuthResponseDTO{" +
                "accessToken='" + accessToken + '\'' +
                ", refreshToken='" + refreshToken + '\'' +
                ", user=" + user +
                '}';
    }

    // equals
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AuthResponseDTO that = (AuthResponseDTO) o;
        return Objects.equals(accessToken, that.accessToken) &&
                Objects.equals(refreshToken, that.refreshToken) &&
                Objects.equals(user, that.user);
    }

    // hashCode
    @Override
    public int hashCode() {
        return Objects.hash(accessToken, refreshToken, user);
    }
}
