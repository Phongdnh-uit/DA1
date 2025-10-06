package com.phongdnh.se121.dtos.authentication;

import com.phongdnh.se121.enums.authentication.OtpChannel;
import com.phongdnh.se121.enums.authentication.OtpPurpose;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendOtpRequest {
  @NotBlank private String destination;
  @NotNull private OtpChannel channel;
  @NotNull private OtpPurpose purpose;
}
