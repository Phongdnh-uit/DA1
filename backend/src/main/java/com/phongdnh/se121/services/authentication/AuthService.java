package com.phongdnh.se121.services.authentication;

import com.phongdnh.se121.dtos.authentication.BaseUserRequest;
import com.phongdnh.se121.dtos.authentication.ChangePasswordRequest;
import com.phongdnh.se121.dtos.authentication.LoginRequest;
import com.phongdnh.se121.dtos.authentication.LoginResponse;
import com.phongdnh.se121.dtos.authentication.RefreshTokenRequest;
import com.phongdnh.se121.dtos.authentication.RegisterRequest;
import com.phongdnh.se121.dtos.authentication.ResetPasswordRequest;
import com.phongdnh.se121.dtos.authentication.SendOtpRequest;
import com.phongdnh.se121.dtos.authentication.SendOtpResponse;
import com.phongdnh.se121.dtos.authentication.UserResponse;
import com.phongdnh.se121.dtos.authentication.VerifyEmailRequest;
import com.phongdnh.se121.dtos.authentication.VerifyOtpRequest;
import com.phongdnh.se121.dtos.authentication.VerifyOtpResponse;
import java.util.List;

public interface AuthService {
  LoginResponse login(LoginRequest request);

  LoginResponse refreshToken(RefreshTokenRequest request);

  void logout(RefreshTokenRequest request);

  SendOtpResponse sendOtp(SendOtpRequest request);

  VerifyOtpResponse verifyOtp(VerifyOtpRequest request);

  UserResponse register(RegisterRequest request);

  void verifyEmail(VerifyEmailRequest request);

  void resetPassword(ResetPasswordRequest request);

  void changePassword(ChangePasswordRequest request);

  UserResponse getCurrentUser();

  UserResponse updateCurrentUser(BaseUserRequest request);

  List<String> getCurrentPermissionCodes();
}
