package com.auth_service.auth.service;

import com.auth_service.auth.dto.AuthResponseDTO;
import com.auth_service.auth.dto.LoginDTO;
import com.auth_service.auth.dto.RegisterDTO;
import com.auth_service.auth.model.User;
import com.auth_service.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {


    private final UserRepository userRepository;
    private final JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // =========================
    // REGISTER
    // =========================
    public void register(RegisterDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()) != null) {
            throw new RuntimeException("email_already_used");
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
        if (user == null) throw new RuntimeException("user_not_found");

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("invalid_credentials");
        }

        if (!user.isVerified()) {
            throw new RuntimeException("email_not_verified");
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
        if (user == null) throw new RuntimeException("invalid_token");

        user.setVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
    }

    // =========================
    // FORGOT PASSWORD
    // =========================
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) return;

        user.setResetPasswordToken(UUID.randomUUID().toString());
        userRepository.save(user);

        System.out.println("Send reset link: " + user.getResetPasswordToken());
    }

    // =========================
    // RESET PASSWORD
    // =========================
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetPasswordToken(token);
        if (user == null) throw new RuntimeException("invalid_token");

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        userRepository.save(user);
    }

    // =========================
    // REFRESH TOKEN
    // =========================
    public AuthResponseDTO refreshToken(String refreshToken) {
        if (!jwtService.validateToken(refreshToken))
            throw new RuntimeException("invalid_token");

        String email = jwtService.extractEmail(refreshToken);

        String newAccess = jwtService.generateAccessToken(email);
        String newRefresh = jwtService.generateRefreshToken(email);

        User user = userRepository.findByEmail(email);

        return new AuthResponseDTO(newAccess, newRefresh, user);
    }
}
