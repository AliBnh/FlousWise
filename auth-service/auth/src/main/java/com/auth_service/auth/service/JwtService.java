package com.auth_service.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;

    public JwtService(@Value("${app.jwt.secret}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // =========================
    // Generate Access Token (15 min)
    // =========================
    public String generateAccessToken(String email, String userId) {
        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // =========================
    // Generate Refresh Token (7 days)
    // =========================
    public String generateRefreshToken(String email, String userId) {
        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 7L * 24 * 60 * 60 * 1000))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // =========================
    // Validate Token
    // =========================
    public boolean validateToken(String token) {
        try {
            extractAllClaims(token); // throws if invalid
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // =========================
    // Extract Email from Token
    // =========================
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // =========================
    // Extract UserId from Token
    // =========================
    public String extractUserId(String token) {
        return extractAllClaims(token).get("userId", String.class);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
