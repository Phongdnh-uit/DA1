package com.phongdnh.se121.exceptions;

import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.exceptions.errors.ApiException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ApiResponse<Void>> handleApiException(ApiException ex) {
    ApiResponse<Void> response = new ApiResponse<>();
    response.setCode(ex.getErrorCode().getCode());
    response.setMessage(ex.getMessage() != null ? ex.getMessage() : ex.getErrorCode().getMessage());
    response.setErrors(ex.getFieldErrors());
    return ResponseEntity.status(ex.getErrorCode().getHttpCode()).body(response);
  }
}
