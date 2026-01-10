package com.phongdnh.se121.securities.oauth2;

import com.phongdnh.se121.constants.AppConstant;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;

@Component
public class CustomAuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {

  private final RedisTemplate<Object, Object> redisTemplate;

  private final ClientRegistrationRepository clientRegistrationRepository;

  private final DefaultOAuth2AuthorizationRequestResolver defaultResolver;

  public CustomAuthorizationRequestResolver(
      RedisTemplate<Object, Object> redisTemplate,
      ClientRegistrationRepository clientRegistrationRepository) {
    this.redisTemplate = redisTemplate;
    this.clientRegistrationRepository = clientRegistrationRepository;
    this.defaultResolver =
        new DefaultOAuth2AuthorizationRequestResolver(
            this.clientRegistrationRepository, AppConstant.OAUTH2_AUTHORIZATION_BASE_URI);
  }

  @Override
  public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
    OAuth2AuthorizationRequest base = defaultResolver.resolve(request);
    return customizeAuthorizationRequest(request, base);
  }

  @Override
  public OAuth2AuthorizationRequest resolve(
      HttpServletRequest request, String clientRegistrationId) {
    OAuth2AuthorizationRequest base = defaultResolver.resolve(request, clientRegistrationId);
    return customizeAuthorizationRequest(request, base);
  }

  private OAuth2AuthorizationRequest customizeAuthorizationRequest(
      HttpServletRequest request, OAuth2AuthorizationRequest base) {
    if (base == null) return null;

    String token = request.getParameter("verificationToken");
    if (token != null) {
      String cachedPhone = (String) redisTemplate.opsForValue().get("REGISTRATION_" + token);
      if (cachedPhone == null) {
        throw new ApiException(ErrorCode.VERIFICATION_CODE_INVALID);
      }
      request.getSession(true).setAttribute("verifiedPhone", cachedPhone);
    }

    return base;
  }
}
