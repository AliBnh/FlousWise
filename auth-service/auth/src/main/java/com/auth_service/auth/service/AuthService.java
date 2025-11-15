package com.auth_service.auth.service;

import com.auth_service.auth.dto.AuthResponseDTO;
import com.auth_service.auth.dto.LoginDTO;
import com.auth_service.auth.dto.RegisterDTO;
import com.auth_service.auth.exception.*;
import com.auth_service.auth.model.User;
import com.auth_service.auth.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    // =========================
    // REGISTER
    // =========================
    public void register(RegisterDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()) != null) {
            throw new EmailAlreadyExistsException("Email is already registered");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setName(dto.getName());
        user.setPassword(passwordEncoder.encode(dto.getPassword())); // hash

        user.setVerificationToken(UUID.randomUUID().toString());

        userRepository.save(user);

        // send verification email (pseudo)
        System.out.println("Send email with token: " + user.getVerificationToken());
    }

    // =========================
    // LOGIN
    // =========================
    public AuthResponseDTO login(LoginDTO dto) {

        User user = userRepository.findByEmail(dto.getEmail());
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (!user.isVerified()) {
            throw new EmailNotVerifiedException("Email not verified. Please check your email to verify your account.");
        }

        String accessToken = jwtService.generateAccessToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return new AuthResponseDTO(accessToken, refreshToken, user);
    }

    // =========================
    // VERIFY EMAIL
    // =========================
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token);
        if (user == null) {
            throw new InvalidTokenException("Invalid or expired verification token");
        }

        user.setVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
    }

    // =========================
    // FORGOT PASSWORD
    // =========================
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) return; // Don't reveal if email exists

        user.setResetPasswordToken(UUID.randomUUID().toString());
        userRepository.save(user);

        System.out.println("Send reset link: " + user.getResetPasswordToken());
    }

    // =========================
    // RESET PASSWORD
    // =========================
//    public void resetPassword(String token, String newPassword) {
//        User user = userRepository.findByResetPasswordToken(token);
//        if (user == null) {
//            throw new InvalidTokenException("Invalid or expired reset token");
//        }
//
//        user.setPassword(passwordEncoder.encode(newPassword));
//        user.setResetPasswordToken(null);
//        userRepository.save(user);
//    }

    // =========================
    // REFRESH TOKEN
    // =========================
    public AuthResponseDTO refreshToken(String refreshToken) {
        if (!jwtService.validateToken(refreshToken)) {
            throw new InvalidTokenException("Invalid or expired refresh token");
        }

        String email = jwtService.extractEmail(refreshToken);

        String newAccess = jwtService.generateAccessToken(email);
        String newRefresh = jwtService.generateRefreshToken(email);

        User user = userRepository.findByEmail(email);

        return new AuthResponseDTO(newAccess, newRefresh, user);
    }
}