package com.phongdnh.se121.repositories.authentication;

import com.phongdnh.se121.entities.authentication.LinkedAccount;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LinkedAccountRepository extends SimpleRepository<LinkedAccount, Long> {}
