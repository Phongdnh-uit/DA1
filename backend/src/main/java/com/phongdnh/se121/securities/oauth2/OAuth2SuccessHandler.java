package com.phongdnh.se121.securities.oauth2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.phongdnh.se121.constants.AppConstant;
import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.dtos.authentication.LoginResponse;
import com.phongdnh.se121.securities.CustomUserDetails;
import com.phongdnh.se121.securities.TokenProvider;
import com.phongdnh.se121.services.authentication.RefreshTokenService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
  private final ObjectMapper mapper;
  private final TokenProvider tokenProvider;
  private final RefreshTokenService refreshTokenService;

  @Override
  public void onAuthenticationSuccess(
      HttpServletRequest request, HttpServletResponse response, Authentication authentication)
      throws IOException, ServletException {
    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
    String accessToken = tokenProvider.generateAccessToken(userDetails.getId());
    String refreshToken = refreshTokenService.createRefreshToken(userDetails.getId()).getToken();
    LoginResponse loginResponse = new LoginResponse();
    loginResponse.setAccessToken(accessToken);
    loginResponse.setRefreshToken(refreshToken);

    ApiResponse<LoginResponse> apiResponse = ApiResponse.ok(loginResponse);

    String html =
        "<!DOCTYPE html>\n"
            + "<html>\n"
            + "<body>\n"
            + "<script>\n"
            + "const response = "
            + mapper.writeValueAsString(apiResponse)
            + ";\n"
            + "window.opener.postMessage(response, '"
            + AppConstant.FRONTEND_URL
            + "');\n"
            + "window.close();\n"
            + "</script>\n"
            + "</body>\n"
            + "</html>";

    response.setContentType("text/html");
    response.getWriter().write(html);
  }
}
