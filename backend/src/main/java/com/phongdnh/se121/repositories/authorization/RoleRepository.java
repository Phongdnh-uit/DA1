package com.phongdnh.se121.repositories.authorization;

import com.phongdnh.se121.entities.authorization.Role;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends SimpleRepository<Role, Long> {}
