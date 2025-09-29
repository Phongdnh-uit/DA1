package com.phongdnh.se121.repositories.authentication;

import com.phongdnh.se121.entities.authentication.User;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends SimpleRepository<User, Long> {}
