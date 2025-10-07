package com.phongdnh.se121.services.authentication;

import com.phongdnh.se121.entities.authentication.RefreshToken;

public interface RefreshTokenService {
  RefreshToken findByToken(String token);

  RefreshToken createRefreshToken(Long userId);

  void verify(RefreshToken token);

  void delete(RefreshToken token);
}
