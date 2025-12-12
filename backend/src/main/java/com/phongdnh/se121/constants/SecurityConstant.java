package com.phongdnh.se121.constants;

public interface SecurityConstant {

  String[] PUBLIC_URLS = {
    "/swagger-ui/**",
    "/v3/api-docs/**",
    "/auth/login",
    "/auth/refresh",
    "/auth/send-otp",
    "/auth/verify-otp",
    "/auth/verify-email",
    "/auth/register",
    "/auth/reset-password",
    "/ai/chat/**",
    "/ws/**"
  };

  String[] PUBLIC_GET_URLS = {
    "/properties/all",
    "/properties/{id}",
    "/provinces/all",
    "/wards/all",
    "/property-types/all",
    "/properties/similar/{id}",
    "/properties/within-radius"
  };

  String[] PUBLIC_POST_URLS = {"/bookings"};
}
