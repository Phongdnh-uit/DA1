package com.phongdnh.se121.hooks.authorizations;

import com.phongdnh.se121.constants.ErrorMessageConstants;
import com.phongdnh.se121.dtos.authorization.RoleRequest;
import com.phongdnh.se121.dtos.authorization.RoleResponse;
import com.phongdnh.se121.entities.authorization.Permission;
import com.phongdnh.se121.entities.authorization.Role;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.hooks.GenericHook;
import com.phongdnh.se121.repositories.authorization.PermissionRepository;
import com.phongdnh.se121.repositories.authorization.RoleRepository;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Component
public class RoleHook implements GenericHook<Role, Long, RoleRequest, RoleResponse> {

  private final RoleRepository roleRepository;
  private final PermissionRepository permissionRepository;

  @Override
  public void validateCreate(RoleRequest input, Map<String, Object> context) {
    validateUniqueName(input.getName(), null);
  }

  @Override
  public void validateUpdate(
      Long id, RoleRequest input, Role existingEntity, Map<String, Object> context) {
    validateUniqueName(input.getName(), id);
  }

  @Override
  public void enrichCreate(RoleRequest input, Role entity, Map<String, Object> context) {
    enrichPermissions(input, entity);
  }

  @Override
  public void enrichUpdate(RoleRequest input, Role entity, Map<String, Object> context) {
    enrichPermissions(input, entity);
  }

  @Override
  public void validateDelete(Long id) {
    if (id == 1L) {
      throw new ApiException(
          ErrorCode.OPERATION_NOT_ALLOWED, Map.of("role", "Cannot delete the administrator role"));
    }
  }

  @Override
  public void validateBulkDelete(Iterable<Long> ids) {
    Set<Long> idSet = new HashSet<>();
    ids.forEach(idSet::add);
    if (idSet.contains(1L)) {
      throw new ApiException(
          ErrorCode.OPERATION_NOT_ALLOWED, Map.of("role", "Cannot delete the administrator role"));
    }
  }

  private void validateUniqueName(String name, Long id) {
    Specification<Role> spec = (root, _, builder) -> builder.equal(root.get("name"), name);
    if (id != null) {
      spec = spec.and((root, _, builder) -> builder.notEqual(root.get("id"), id));
    }
    if (roleRepository.exists(spec)) {
      throw new ApiException(
          ErrorCode.RESOURCE_EXISTS,
          new HashMap<>() {
            {
              put("name", "Already exists");
            }
          });
    }
  }

  @Transactional
  private void enrichPermissions(RoleRequest input, Role entity) {
    if (input.getPermissionIds() == null || input.getPermissionIds().isEmpty()) {
      return;
    }
    long count =
        permissionRepository.count((root, _, _) -> root.get("id").in(input.getPermissionIds()));
    if (count != input.getPermissionIds().size()) {
      throw new ApiException(
          ErrorCode.RESOURCE_NOT_FOUND, Map.of("permissions", ErrorMessageConstants.AUTH_PERMISSION_NOT_FOUND));
    }
    List<Permission> allPermissions =
        permissionRepository.findAll((root, _, _) -> root.get("id").in(input.getPermissionIds()));

    // Set<Permission> refs = allPermissions.stream().collect(Collectors.toSet());
    entity.getPermissions().clear();
    for (Permission p : allPermissions) {
      entity.getPermissions().add(p);
    }

    // Set<Permission> refs =
    //     input.getPermissionIds().stream()
    //         .map(id -> permissionRepository.getReferenceById(id))
    //         .collect(Collectors.toSet());
    // entity.setPermissions(refs);
  }
}
