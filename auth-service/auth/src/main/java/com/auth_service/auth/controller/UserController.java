package com.auth_service.auth.controller;

import com.auth_service.auth.model.User;
import com.auth_service.auth.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@Tag(name = "User", description = "Protected user endpoints requiring authentication")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    @Operation(
        summary = "Get current user profile",
        description = "Returns the profile information of the currently authenticated user. Requires valid JWT token.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    public ResponseEntity<Map<String, Object>> getProfile() {
        // Get authentication from security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        // Get email from authentication principal
        String email = authentication.getName();

        // Find user by email
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        // Return user profile (excluding sensitive information)
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("email", user.getEmail());
        profile.put("name", user.getName());
        profile.put("verified", user.isVerified());
        profile.put("createdAt", user.getCreatedAt());

        return ResponseEntity.ok(profile);
    }

    @GetMapping("/protected-test")
    @Operation(
        summary = "Protected test endpoint",
        description = "A simple test endpoint to verify JWT authentication is working. Returns a success message if authenticated.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    public ResponseEntity<Map<String, String>> protectedTest() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Map<String, String> response = new HashMap<>();
        response.put("message", "You are authenticated!");
        response.put("email", email);

        return ResponseEntity.ok(response);
    }
}
