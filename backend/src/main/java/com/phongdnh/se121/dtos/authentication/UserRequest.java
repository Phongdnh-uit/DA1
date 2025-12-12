package com.phongdnh.se121.dtos.authentication;

import com.phongdnh.se121.dtos.Action.Create;
import com.phongdnh.se121.enums.authentication.UserStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest extends BaseUserRequest {

  @NotBlank(groups = {Create.class})
  private String password;

  private boolean emailVerified = false;

  private boolean phoneVerified = false;

  private UserStatus status = UserStatus.UNVERIFIED;

  @NotNull private Long roleId;
}
