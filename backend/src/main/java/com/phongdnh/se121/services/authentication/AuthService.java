package com.phongdnh.se121.services.authentication;

import com.phongdnh.se121.dtos.authentication.LoginRequest;
import com.phongdnh.se121.dtos.authentication.LoginResponse;

public interface AuthService {
  LoginResponse login(LoginRequest request);
}
