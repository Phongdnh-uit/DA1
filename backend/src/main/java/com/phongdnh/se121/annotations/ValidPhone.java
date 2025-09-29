package com.phongdnh.se121.annotations;

import com.phongdnh.se121.utils.PhoneValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = PhoneValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPhone {
  String message() default "Invalid phone number";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

  String defaultRegion() default "VN";
}
