package com.finance_service.finance.controller;

import com.finance_service.finance.dto.DashboardSummaryResponse;
import com.finance_service.finance.dto.ProfileResponse;
import com.finance_service.finance.model.UserProfile;
import com.finance_service.finance.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping
    public ResponseEntity<ProfileResponse> createProfile(
            Authentication authentication,
            @RequestBody @Valid UserProfile profileData) {
        String userId = (String) authentication.getPrincipal();
        ProfileResponse response = profileService.createProfile(userId, profileData);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        ProfileResponse response = profileService.getProfile(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
            Authentication authentication,
            @RequestBody @Valid UserProfile profileData) {
        String userId = (String) authentication.getPrincipal();
        ProfileResponse response = profileService.updateProfile(userId, profileData);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteProfile(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        profileService.deleteProfile(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        DashboardSummaryResponse response = profileService.getDashboardSummary(userId);
        return ResponseEntity.ok(response);
    }
}
