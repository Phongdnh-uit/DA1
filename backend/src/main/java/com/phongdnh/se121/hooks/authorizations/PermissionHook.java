package com.phongdnh.se121.hooks.authorizations;

import com.phongdnh.se121.dtos.authorization.PermissionRequestDTO;
import com.phongdnh.se121.dtos.authorization.PermissionResponseDTO;
import com.phongdnh.se121.entities.authorization.Permission;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.hooks.DefaultHook;
import com.phongdnh.se121.repositories.authorization.PermissionRepository;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class PermissionHook
    extends DefaultHook<Permission, Long, PermissionRequestDTO, PermissionResponseDTO> {
  private final PermissionRepository permissionRepository;

  @Override
  public void validateCreate(PermissionRequestDTO input, Map<String, Object> context) {
    validatePermission(input, null);
  }

  @Override
  public void validateUpdate(
      Long id, PermissionRequestDTO input, Permission existingEntity, Map<String, Object> context) {
    validatePermission(input, id);
  }

  private void validatePermission(PermissionRequestDTO request, Long id) {
    request.setResource(request.getResource().toUpperCase());
    Specification<Permission> validateSpec =
        (root, _, builder) ->
            builder.and(
                builder.equal(root.get("action"), request.getAction()),
                builder.equal(root.get("resource"), request.getResource()));
    if (id != null) {
      validateSpec = validateSpec.and((root, _, builder) -> builder.notEqual(root.get("id"), id));
    }
    if (permissionRepository.exists(validateSpec)) {
      throw new ApiException(
          ErrorCode.RESOURCE_EXISTS, "Permission with the same action and resource already exists");
    }
  }
}
