package com.phongdnh.se121.dtos.authentication;

import com.phongdnh.se121.enums.authentication.OtpPurpose;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyOtpRequest {
  @NotBlank private String destination;

  @Min(6)
  @Max(6)
  @NotBlank
  private String otp;

  private OtpPurpose purpose;
}
