package com.phongdnh.se121.dtos.authentication;

import com.phongdnh.se121.enums.authentication.OtpChannel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendOtpResponse {
  private String maskedDestination;
  private Integer resendAfter; // in seconds
  private Integer expiresIn; // in seconds
  private OtpChannel channel;
}
