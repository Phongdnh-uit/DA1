package com.phongdnh.se121.dtos.authentication;

import com.phongdnh.se121.annotations.ValidPhone;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseUserRequest {
  private String fullName;

  @NotBlank @Email private String email;

  @NotBlank @ValidPhone private String phone;

  private Long avatarId;
}
