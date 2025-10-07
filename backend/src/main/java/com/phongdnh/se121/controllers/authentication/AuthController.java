package com.phongdnh.se121.controllers.authentication;

import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.dtos.authentication.LoginRequest;
import com.phongdnh.se121.dtos.authentication.LoginResponse;
import com.phongdnh.se121.dtos.authentication.RegisterRequest;
import com.phongdnh.se121.dtos.authentication.ResetPasswordRequest;
import com.phongdnh.se121.dtos.authentication.SendOtpRequest;
import com.phongdnh.se121.dtos.authentication.SendOtpResponse;
import com.phongdnh.se121.dtos.authentication.UserResponse;
import com.phongdnh.se121.dtos.authentication.VerifyEmailRequest;
import com.phongdnh.se121.dtos.authentication.VerifyOtpRequest;
import com.phongdnh.se121.dtos.authentication.VerifyOtpResponse;
import com.phongdnh.se121.services.authentication.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth")
@RequestMapping("/auth")
@RequiredArgsConstructor
@RestController
public class AuthController {
  private final AuthService authService;

  @PostMapping("/login")
  public ResponseEntity<ApiResponse<LoginResponse>> login(
      @Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(ApiResponse.ok(authService.login(request)));
  }

  @PostMapping("/send-otp")
  public ResponseEntity<ApiResponse<SendOtpResponse>> sendOtp(
      @Valid @RequestBody SendOtpRequest request) {
    return ResponseEntity.ok(ApiResponse.ok(authService.sendOtp(request)));
  }

  @PostMapping("/verify-otp")
  public ResponseEntity<ApiResponse<VerifyOtpResponse>> verifyOtp(
      @Valid @RequestBody VerifyOtpRequest request) {
    return ResponseEntity.ok(ApiResponse.ok(authService.verifyOtp(request)));
  }

  @PostMapping("/verify-email")
  public ResponseEntity<ApiResponse<Void>> verifyEmail(
      @Valid @RequestBody VerifyEmailRequest request) {
    authService.verifyEmail(request);
    return ResponseEntity.ok(ApiResponse.ok(null));
  }

  @PostMapping("/register")
  public ResponseEntity<ApiResponse<UserResponse>> register(
      @Valid @RequestBody RegisterRequest request) {
    return ResponseEntity.ok(ApiResponse.ok(authService.register(request)));
  }

  @PostMapping("/reset-password")
  public ResponseEntity<ApiResponse<Void>> resetPassword(
      @Valid @RequestBody ResetPasswordRequest request) {
    authService.resetPassword(request);
    return ResponseEntity.ok(ApiResponse.ok(null));
  }
}
