package com.phongdnh.se121.services.authentication;

import com.phongdnh.se121.dtos.authentication.LoginRequest;
import com.phongdnh.se121.dtos.authentication.LoginResponse;
import com.phongdnh.se121.securities.SecurityUtil;
import com.phongdnh.se121.securities.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {
  private final AuthenticationManagerBuilder authenticationManagerBuilder;
  private final TokenProvider tokenProvider;
  private final RefreshTokenService refreshTokenService;

  @Override
  public LoginResponse login(LoginRequest request) {
    // 1. ---- Authenticate ----
    UsernamePasswordAuthenticationToken authenticationToken =
        new UsernamePasswordAuthenticationToken(request.getCredential(), request.getPassword());
    Authentication authentication =
        authenticationManagerBuilder.getObject().authenticate(authenticationToken);
    // 2. ---- Set to security holder  ----
    SecurityContextHolder.getContext().setAuthentication(authentication);

    // 3. ---- Generate JWT ----
    Long userId = SecurityUtil.getCurrentUserId();
    String jwt = tokenProvider.generateAccessToken(userId);
    String refreshToken = refreshTokenService.createRefreshToken(userId).getToken();

    // 4. ---- Response ----
    LoginResponse response = new LoginResponse();
    response.setAccessToken(jwt);
    response.setRefreshToken(refreshToken);
    return response;
  }
}
