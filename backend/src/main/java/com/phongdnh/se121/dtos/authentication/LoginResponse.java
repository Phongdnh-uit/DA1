package com.phongdnh.se121.dtos.authentication;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
  private String accessToken;
  private String refreshToken;
}
