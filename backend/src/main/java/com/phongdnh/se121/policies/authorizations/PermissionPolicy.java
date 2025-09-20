package com.phongdnh.se121.policies.authorizations;

import com.phongdnh.se121.dtos.authorization.PermissionRequestDTO;
import com.phongdnh.se121.entities.authorization.Permission;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.policies.GenericPolicy;
import com.phongdnh.se121.repositories.authorization.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class PermissionPolicy implements GenericPolicy<Permission, Long, PermissionRequestDTO> {
  private final PermissionRepository permissionRepository;

  @Override
  public void validateCreate(PermissionRequestDTO input) {
    validatePermission(input, null);
  }

  @Override
  public void validateUpdate(Long id, PermissionRequestDTO input, Permission existingEntity) {
    validatePermission(input, id);
  }

  private void validatePermission(PermissionRequestDTO request, Long id) {
    Specification<Permission> validateSpec =
        (root, _, builder) ->
            builder.and(
                builder.equal(root.get("name"), request.getName()),
                builder.equal(root.get("resource"), request.getResource()));
    if (id != null) {
      validateSpec = validateSpec.and((root, _, builder) -> builder.notEqual(root.get("id"), id));
    }
    if (permissionRepository.exists(validateSpec)) {
      throw new ApiException(
          ErrorCode.RESOURCE_EXISTS, "Permission with the same name and resource already exists");
    }
  }
}
