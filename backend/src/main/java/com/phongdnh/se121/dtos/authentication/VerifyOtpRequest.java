package com.phongdnh.se121.dtos.authentication;

import com.phongdnh.se121.enums.authentication.OtpPurpose;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
public class VerifyOtpRequest {
  @NotBlank private String destination;

  @Length(min = 6, max = 6)
  @NotBlank
  private String otp;

  private OtpPurpose purpose;
}
