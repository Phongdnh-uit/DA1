package com.phongdnh.se121.repositories.authentication;

import com.phongdnh.se121.entities.authentication.RefreshToken;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends SimpleRepository<RefreshToken, Long> {}
