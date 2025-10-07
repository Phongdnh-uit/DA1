package com.phongdnh.se121.dtos.authentication;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
  @NotBlank private String verificationToken;
  @Email private String email;
  @NotBlank private String fullName;
  @NotBlank private String password;
}
