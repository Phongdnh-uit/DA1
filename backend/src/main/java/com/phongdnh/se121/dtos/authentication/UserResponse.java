package com.phongdnh.se121.dtos.authentication;

import com.phongdnh.se121.dtos.general.MediaResponse;
import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.authentication.UserStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse extends BaseEntity {
  private String fullName;

  private String email;

  private String phone;

  private boolean emailVerified;

  private boolean phoneVerified;

  private UserStatus status;

  private Long roleId;

  private MediaResponse avatar;
}
