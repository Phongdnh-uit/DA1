package com.phongdnh.se121.securities.oauth2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.phongdnh.se121.constants.AppConstant;
import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class OAuth2FailureHandler implements AuthenticationFailureHandler {

  private final ObjectMapper mapper;

  @Override
  public void onAuthenticationFailure(
      HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
      throws IOException, ServletException {
    ApiResponse<Void> apiResponse = new ApiResponse<>();
    apiResponse.setCode(ErrorCode.OAUTH2_ERROR.getCode());
    if (exception instanceof OAuth2AuthenticationException oAuth2Exception) {
      if (oAuth2Exception.getCause() instanceof ApiException apiException) {
        apiResponse.setMessage(apiException.getMessage());
        apiResponse.setErrors(apiException.getFieldErrors());
      }
    } else {
      apiResponse.setMessage(exception.getMessage());
    }

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
