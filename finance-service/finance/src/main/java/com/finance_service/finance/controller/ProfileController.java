package com.finance_service.finance.controller;

import com.finance_service.finance.dto.DashboardSummaryResponse;
import com.finance_service.finance.dto.ProfileResponse;
import com.finance_service.finance.model.UserProfile;
import com.finance_service.finance.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping
    public ResponseEntity<ProfileResponse> createProfile(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody @Valid UserProfile profileData) {
        ProfileResponse response = profileService.createProfile(userId, profileData);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable String userId) {
        ProfileResponse response = profileService.getProfile(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ProfileResponse> updateProfile(
            @PathVariable String userId,
            @RequestBody @Valid UserProfile profileData) {
        ProfileResponse response = profileService.updateProfile(userId, profileData);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteProfile(@PathVariable String userId) {
        profileService.deleteProfile(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/dashboard")
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary(@PathVariable String userId) {
        DashboardSummaryResponse response = profileService.getDashboardSummary(userId);
        return ResponseEntity.ok(response);
    }
}
