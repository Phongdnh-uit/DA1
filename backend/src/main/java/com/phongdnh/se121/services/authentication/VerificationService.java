package com.phongdnh.se121.services.authentication;

import com.phongdnh.se121.entities.authentication.Verification;
import com.phongdnh.se121.enums.authentication.VerificationType;

public interface VerificationService {
  Verification findByTypeAndCode(VerificationType type, String code);

  String generateVerificationCode(VerificationType type, Integer expirationTime, Long userId);

  Verification verifyCode(VerificationType type, String code);

  void deleteCode(VerificationType type, String code);
}
