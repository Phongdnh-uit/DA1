package com.phongdnh.se121.services.authentication;

import com.phongdnh.se121.entities.authentication.Verification;
import com.phongdnh.se121.enums.authentication.VerificationType;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.repositories.authentication.UserRepository;
import com.phongdnh.se121.repositories.authentication.VerificationRepository;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class VerificationServiceImpl implements VerificationService {
  private final UserRepository userRepository;
  private final VerificationRepository verificationRepository;

  @Override
  public String generateVerificationCode(
      VerificationType type, Integer expirationTimeInSeconds, Long userId) {
    String code = UUID.randomUUID().toString();
    Verification entity = new Verification();
    entity.setCode(code);
    entity.setType(type);
    entity.setExpiresAt(Instant.now().plusSeconds(expirationTimeInSeconds));
    if (userRepository.findById(userId).isEmpty()) {
      throw new ApiException(ErrorCode.RESOURCE_NOT_FOUND);
    }
    entity.setUserId(userId);
    return verificationRepository.save(entity).getCode();
  }

  @Override
  public Verification verifyCode(VerificationType type, String code) {
    Optional<Verification> verification =
        verificationRepository.findOne(
            (root, _, builder) ->
                builder.and(
                    builder.equal(root.get("type"), type), builder.equal(root.get("code"), code)));
    if (verification.isEmpty()) {
      throw new ApiException(ErrorCode.VERIFICATION_CODE_INVALID);
    }
    if (verification.get().getExpiresAt().isBefore(Instant.now())) {
      verificationRepository.delete(verification.get());
      throw new ApiException(ErrorCode.VERIFICATION_CODE_EXPIRED);
    }
    return verification.get();
  }

  @Override
  public void deleteCode(VerificationType type, String code) {
    verificationRepository.delete(
        (root, _, builder) ->
            builder.and(
                builder.equal(root.get("type"), type), builder.equal(root.get("code"), code)));
  }

  @Override
  public Verification findByTypeAndCode(VerificationType type, String code) {
    return verificationRepository
        .findOne(
            (root, _, builder) ->
                builder.and(
                    builder.equal(root.get("type"), type), builder.equal(root.get("code"), code)))
        .orElseThrow(() -> new ApiException(ErrorCode.VERIFICATION_CODE_INVALID));
  }
}
