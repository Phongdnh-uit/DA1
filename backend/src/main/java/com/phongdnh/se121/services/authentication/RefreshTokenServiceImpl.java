package com.phongdnh.se121.services.authentication;

import com.phongdnh.se121.entities.authentication.RefreshToken;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.repositories.authentication.RefreshTokenRepository;
import com.phongdnh.se121.repositories.authentication.UserRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {
  @Value("${jwt.refresh-token.expiration}")
  private Long expiration;

  private final RefreshTokenRepository refreshTokenRepository;
  private final UserRepository userRepository;

  @Override
  public RefreshToken findByToken(String token) {
    return refreshTokenRepository
        .findOne((root, _, builder) -> builder.equal(root.get("token"), token))
        .orElseThrow(() -> new ApiException(ErrorCode.TOKEN_INVALID));
  }

  @Override
  public RefreshToken createRefreshToken(Long userId) {
    if (!userRepository.existsById(userId)) {
      throw new ApiException(ErrorCode.RESOURCE_NOT_FOUND);
    }
    RefreshToken refreshToken = new RefreshToken();
    refreshToken.setUserId(userId);
    refreshToken.setExpiresAt(Instant.now().plusSeconds(expiration));
    refreshToken.setToken(UUID.randomUUID().toString());
    return refreshTokenRepository.save(refreshToken);
  }

  @Override
  public void verify(RefreshToken token) {
    if (token.getExpiresAt().isBefore(Instant.now())) {
      refreshTokenRepository.delete(token);
      throw new ApiException(ErrorCode.TOKEN_EXPIRED);
    }
  }

  @Override
  public void delete(RefreshToken token) {
    refreshTokenRepository.delete(token);
  }
}
