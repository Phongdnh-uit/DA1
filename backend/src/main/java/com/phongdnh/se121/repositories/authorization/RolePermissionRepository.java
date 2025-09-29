package com.phongdnh.se121.repositories.authorization;

import com.phongdnh.se121.entities.authorization.RolePermission;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolePermissionRepository extends SimpleRepository<RolePermission, Long> {}
