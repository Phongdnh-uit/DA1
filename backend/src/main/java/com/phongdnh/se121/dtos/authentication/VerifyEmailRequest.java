package com.phongdnh.se121.dtos.authentication;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyEmailRequest {
  @NotBlank private String code;
}
