package com.phongdnh.se121.securities;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
  private final ObjectMapper objectMapper;

  @Override
  public void commence(
      HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException authException)
      throws IOException, ServletException {
    ApiResponse<Void> apiResponse = new ApiResponse<>();
    Throwable cause = authException.getCause();
    if (cause != null && cause instanceof BadJwtException jwtValidationException) {
      boolean isExpired = jwtValidationException.getMessage().contains("expired");
      if (isExpired) {
        apiResponse.setCode(ErrorCode.TOKEN_EXPIRED.getCode());
        apiResponse.setMessage(ErrorCode.TOKEN_EXPIRED.getMessage());
      } else {
        apiResponse.setCode(ErrorCode.TOKEN_INVALID.getCode());
        apiResponse.setMessage(ErrorCode.TOKEN_INVALID.getMessage());
      }
    } else {
      apiResponse.setCode(ErrorCode.AUTHENTICATION_REQUIRED.getCode());
      apiResponse.setMessage(authException.getMessage());
    }

    response.setStatus(HttpStatus.UNAUTHORIZED.value());
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");

    objectMapper.writeValue(response.getOutputStream(), apiResponse);
  }
}
