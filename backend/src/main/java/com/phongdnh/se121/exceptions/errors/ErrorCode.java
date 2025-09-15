package com.phongdnh.se121.exceptions.errors;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
  VALIDATION_ERROR(2000, HttpStatus.BAD_REQUEST, "Validation Error"),
  RESOURCE_EXISTS(2001, HttpStatus.CONFLICT, "Resource Exists"),
  RESOURCE_NOT_FOUND(2002, HttpStatus.NOT_FOUND, "Resource Not Found"),
  AUTHENTICATION_REQUIRED(2003, HttpStatus.UNAUTHORIZED, "Authentication Required"),
  FORBIDDEN(2004, HttpStatus.FORBIDDEN, "Forbidden"),
  TOKEN_EXPIRED(2005, HttpStatus.UNAUTHORIZED, "Token Expired"),
  TOKEN_INVALID(2006, HttpStatus.UNAUTHORIZED, "Token Invalid"),
  INTERNAL_SERVER_ERROR(2099, HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
  OTP_EXPIRED(2100, HttpStatus.BAD_REQUEST, "OTP Expired"),
  OTP_INVALID(2101, HttpStatus.BAD_REQUEST, "OTP Invalid"),
  ACCOUNT_LOCKED(2200, HttpStatus.LOCKED, "Account Locked"),
  ACCOUNT_DISABLED(2201, HttpStatus.FORBIDDEN, "Account Disabled"),
  EMAIL_NOT_VERIFIED(2202, HttpStatus.PRECONDITION_REQUIRED, "Email Not Verified");

  private final int code;
  private final HttpStatus httpCode;
  private final String message;

  ErrorCode(int code, HttpStatus httpCode, String message) {
    this.code = code;
    this.httpCode = httpCode;
    this.message = message;
  }
}
