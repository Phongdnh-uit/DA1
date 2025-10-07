package com.phongdnh.se121.repositories.authentication;

import com.phongdnh.se121.entities.authentication.Verification;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationRepository extends SimpleRepository<Verification, Long> {}
