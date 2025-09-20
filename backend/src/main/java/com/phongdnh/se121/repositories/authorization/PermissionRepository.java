package com.phongdnh.se121.repositories.authorization;

import com.phongdnh.se121.entities.authorization.Permission;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepository extends SimpleRepository<Permission, Long> {}
