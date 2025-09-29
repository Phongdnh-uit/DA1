package com.phongdnh.se121.services.authorization;

import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.authorization.RoleRequestDTO;
import com.phongdnh.se121.dtos.authorization.RoleResponseDTO;
import com.phongdnh.se121.entities.authorization.Permission;
import com.phongdnh.se121.entities.authorization.Role;
import com.phongdnh.se121.entities.authorization.RolePermission;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.mappers.authorization.RoleMapper;
import com.phongdnh.se121.repositories.authorization.PermissionRepository;
import com.phongdnh.se121.repositories.authorization.RolePermissionRepository;
import com.phongdnh.se121.repositories.authorization.RoleRepository;
import jakarta.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RoleService implements IRoleSerivce {
  private final RoleRepository roleRepository;
  private final RoleMapper roleMapper;
  private final RolePermissionRepository rolePermissionRepository;
  private final PermissionRepository permissionRepository;

  @Override
  public PageResponse<RoleResponseDTO> findAll(
      Pageable pageable, Specification<Role> specification) {
    return defaultFindAll(pageable, specification, roleMapper, roleRepository);
  }

  @Override
  public RoleResponseDTO findById(Long id) {
    Role entity =
        roleRepository
            .findById(id)
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    RoleResponseDTO dto = roleMapper.entityToResponse(entity);
    List<RolePermission> rolePermissions =
        rolePermissionRepository.findAll(
            (root, _, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("roleId"), entity.getId()));
    dto.setPermissionIds(rolePermissions.stream().map(RolePermission::getPermissionId).toList());
    return dto;
  }

  @Override
  public RoleResponseDTO create(RoleRequestDTO input) {
    input.setName(input.getName().toUpperCase());
    validateUniqueName(input.getName(), null);
    Role entity = roleMapper.requestToEntity(input);
    roleRepository.save(entity);
    List<RolePermission> rolePermissions = enrichPermissions(input, entity);
    RoleResponseDTO dto = roleMapper.entityToResponse(entity);
    dto.setPermissionIds(rolePermissions.stream().map(RolePermission::getPermissionId).toList());
    return dto;
  }

  @Override
  public RoleResponseDTO update(Long id, RoleRequestDTO input) {
    Role existing =
        roleRepository
            .findById(id)
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    input.setName(input.getName().toUpperCase());
    validateUniqueName(input.getName(), id);
    roleMapper.partialUpdate(input, existing);
    roleRepository.save(existing);
    List<RolePermission> rolePermissions = enrichPermissions(input, existing);
    RoleResponseDTO dto = roleMapper.entityToResponse(existing);
    dto.setPermissionIds(rolePermissions.stream().map(RolePermission::getPermissionId).toList());
    return dto;
  }

  @Override
  public void delete(Long id) {
    roleRepository.deleteById(id);
  }

  @Override
  public void deleteAll(Iterable<Long> ids) {}

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
  private List<RolePermission> enrichPermissions(RoleRequestDTO input, Role entity) {
    rolePermissionRepository.delete(
        (root, _, criteriaBuilder) -> criteriaBuilder.equal(root.get("roleId"), entity.getId()));
    List<Permission> permissions = permissionRepository.findAllById(input.getPermissionIds());
    List<RolePermission> rolePermissions =
        permissions.stream()
            .map(
                p -> {
                  RolePermission rp = new RolePermission();
                  rp.setRoleId(entity.getId());
                  rp.setPermissionId(p.getId());
                  return rp;
                })
            .toList();
    return rolePermissionRepository.saveAll(rolePermissions);
  }
}
