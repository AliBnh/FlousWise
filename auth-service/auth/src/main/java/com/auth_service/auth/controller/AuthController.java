package com.auth_service.auth.controller;

import com.auth_service.auth.dto.AuthResponseDTO;
import com.auth_service.auth.dto.LoginDTO;
import com.auth_service.auth.dto.RegisterDTO;
//import com.auth_service.auth.dto.ResetPasswordDTO;
import com.auth_service.auth.dto.RefreshTokenDTO;
import com.auth_service.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterDTO dto) {
        authService.register(dto);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Registration successful. Please check your email to verify your account.");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginDTO dto) {
        AuthResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(response);
    }

    // =========================
    // VERIFY EMAIL
    // =========================
    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Email verified successfully. You can now login.");

        return ResponseEntity.ok(response);
    }



    // =========================
    // RESET PASSWORD
    // =========================
//    @PostMapping("/reset-password")
//    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordDTO dto) {
//        authService.resetPassword(dto.getToken(), dto.getNewPassword());
//
//        Map<String, String> response = new HashMap<>();
//        response.put("message", "Password reset successful. You can now login with your new password.");
//
//        return ResponseEntity.ok(response);
//    }

    // =========================
    // REFRESH TOKEN
    // =========================
    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponseDTO> refreshToken(@Valid @RequestBody RefreshTokenDTO dto) {
        AuthResponseDTO response = authService.refreshToken(dto.getRefreshToken());
        return ResponseEntity.ok(response);
    }
}