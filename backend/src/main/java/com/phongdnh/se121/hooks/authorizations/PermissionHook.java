package com.phongdnh.se121.hooks.authorizations;

import com.phongdnh.se121.constants.ErrorMessageConstants;
import com.phongdnh.se121.dtos.authorization.PermissionRequest;
import com.phongdnh.se121.dtos.authorization.PermissionResponse;
import com.phongdnh.se121.entities.authorization.Permission;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.hooks.GenericHook;
import com.phongdnh.se121.repositories.authorization.PermissionRepository;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class PermissionHook
    implements GenericHook<Permission, Long, PermissionRequest, PermissionResponse> {
  private final PermissionRepository permissionRepository;

  @Override
  public void validateCreate(PermissionRequest input, Map<String, Object> context) {
    validatePermission(input, null);
  }

  @Override
  public void validateUpdate(
      Long id, PermissionRequest input, Permission existingEntity, Map<String, Object> context) {
    validatePermission(input, id);
  }

  private void validatePermission(PermissionRequest request, Long id) {
    request.setResource(request.getResource().toUpperCase());
    Specification<Permission> validateSpec =
        (root, _, builder) ->
            builder.and(
                builder.equal(root.get("method"), request.getMethod()),
                builder.equal(root.get("urlPattern"), request.getUrlPattern()));
    if (id != null) {
      validateSpec = validateSpec.and((root, _, builder) -> builder.notEqual(root.get("id"), id));
    }
    if (permissionRepository.exists(validateSpec)) {
      throw new ApiException(
          ErrorCode.RESOURCE_EXISTS, ErrorMessageConstants.AUTH_PERMISSION_ALREADY_EXISTS);
    }
  }
}
