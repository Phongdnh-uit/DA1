package com.phongdnh.se121.exceptions.errors;

import java.util.Map;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class ApiException extends RuntimeException {
  private final ErrorCode errorCode;
  private final Map<String, String> fieldErrors;

  public ApiException(ErrorCode errorCode) {
    super(errorCode.getMessage());
    this.errorCode = errorCode;
    this.fieldErrors = null;
  }

  public ApiException(ErrorCode errorCode, String message) {
    super(message);
    this.errorCode = errorCode;
    this.fieldErrors = null;
  }

  public ApiException(ErrorCode errorCode, Map<String, String> fieldErrors) {
    super(errorCode.getMessage());
    this.errorCode = errorCode;
    this.fieldErrors = fieldErrors;
  }

  public ApiException(ErrorCode errorCode, String message, Map<String, String> fieldErrors) {
    super(message);
    this.errorCode = errorCode;
    this.fieldErrors = fieldErrors;
  }
}
