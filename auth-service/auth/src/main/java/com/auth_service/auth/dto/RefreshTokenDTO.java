package com.auth_service.auth.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Objects;

public class RefreshTokenDTO {

    @NotBlank(message = "Refresh token is required")
    private String refreshToken;

    // Getter
    public String getRefreshToken() {
        return refreshToken;
    }

    // Setter
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    // toString
    @Override
    public String toString() {
        return "RefreshTokenDTO{" +
                "refreshToken='" + refreshToken + '\'' +
                '}';
    }

    // equals
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RefreshTokenDTO that = (RefreshTokenDTO) o;
        return Objects.equals(refreshToken, that.refreshToken);
    }

    // hashCode
    @Override
    public int hashCode() {
        return Objects.hash(refreshToken);
    }
}