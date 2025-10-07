package com.phongdnh.se121.utils;

import com.phongdnh.se121.annotations.ValidPhone;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PhoneValidator implements ConstraintValidator<ValidPhone, String> {

  private String defaultRegion;

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    if (value == null || value.isEmpty()) {
      return false;
    }
    return ValidationUtil.isValidPhoneNumber(value, defaultRegion);
  }

  @Override
  public void initialize(ValidPhone constraintAnnotation) {
    this.defaultRegion = constraintAnnotation.defaultRegion();
  }
}
