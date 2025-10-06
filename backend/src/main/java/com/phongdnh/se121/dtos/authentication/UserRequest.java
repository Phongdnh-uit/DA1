package com.phongdnh.se121.dtos.authentication;

import com.phongdnh.se121.annotations.ValidPhone;
import com.phongdnh.se121.dtos.Action.Create;
import com.phongdnh.se121.enums.authentication.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {
  private String fullName;

  @NotBlank @Email private String email;

  @NotBlank @ValidPhone private String phone;

  @NotBlank(groups = {Create.class})
  private String password;

  private boolean emailVerified = false;

  private boolean phoneVerified = false;

  private UserStatus status = UserStatus.UNVERIFIED;

  @NotNull private Long roleId;
}
