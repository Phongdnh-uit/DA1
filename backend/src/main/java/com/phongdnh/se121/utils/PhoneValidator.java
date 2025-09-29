package com.phongdnh.se121.utils;

import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.phongdnh.se121.annotations.ValidPhone;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PhoneValidator implements ConstraintValidator<ValidPhone, String> {

  private String defaultRegion;
  private final PhoneNumberUtil phoneNumberUtil = PhoneNumberUtil.getInstance();

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    if (value == null || value.isEmpty()) {
      return false;
    }
    try {
      var phoneNumber = phoneNumberUtil.parse(value, defaultRegion);
      return phoneNumberUtil.isValidNumber(phoneNumber);
    } catch (Exception e) {
      return false;
    }
  }

  @Override
  public void initialize(ValidPhone constraintAnnotation) {
    this.defaultRegion = constraintAnnotation.defaultRegion();
  }
}
