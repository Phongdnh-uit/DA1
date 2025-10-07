package com.phongdnh.se121.dtos.authentication;

import com.phongdnh.se121.enums.authentication.OtpPurpose;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyOtpResponse {
  private String verificationToken;
  private OtpPurpose purpose;
}
