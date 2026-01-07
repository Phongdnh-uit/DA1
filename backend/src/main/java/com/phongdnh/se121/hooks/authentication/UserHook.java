package com.phongdnh.se121.hooks.authentication;

import com.phongdnh.se121.constants.ErrorMessageConstants;
import com.phongdnh.se121.dtos.authentication.UserRequest;
import com.phongdnh.se121.dtos.authentication.UserResponse;
import com.phongdnh.se121.entities.authentication.User;
import com.phongdnh.se121.enums.authentication.UserStatus;
import com.phongdnh.se121.enums.general.FilePurpose;
import com.phongdnh.se121.enums.general.FileUsageStatus;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.hooks.GenericHook;
import com.phongdnh.se121.repositories.authentication.UserRepository;
import com.phongdnh.se121.repositories.authorization.RoleRepository;
import com.phongdnh.se121.repositories.general.FileRepository;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class UserHook implements GenericHook<User, Long, UserRequest, UserResponse> {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final RoleRepository roleRepository;
  private final FileRepository fileRepository;

  @Override
  public void validateCreate(UserRequest input, Map<String, Object> context) {
    validate(input, null);
  }

  @Override
  public void validateUpdate(
      Long id, UserRequest input, User existingEntity, Map<String, Object> context) {
    validate(input, id);
  }

  @Override
  public void enrichCreate(UserRequest input, User entity, Map<String, Object> context) {
    entity.setPasswordHash(passwordEncoder.encode(input.getPassword()));
    enrich(input, entity);
  }

  @Override
  public void enrichUpdate(UserRequest input, User entity, Map<String, Object> context) {
    enrich(input, entity);
  }

  private void validate(UserRequest input, Long id) {
    Map<String, String> errors = new HashMap<>();
    Specification<User> emailSpec =
        (root, _, builder) -> builder.equal(root.get("email"), input.getEmail());
    if (id != null) {
      emailSpec = emailSpec.and((root, _, builder) -> builder.notEqual(root.get("id"), id));
    }
    if (userRepository.exists(emailSpec)) {
      errors.put("email", "Email is already taken");
    }

    Specification<User> phoneSpec =
        (root, _, builder) -> builder.equal(root.get("phone"), input.getPhone());
    if (id != null) {
      phoneSpec = phoneSpec.and((root, _, builder) -> builder.notEqual(root.get("id"), id));
    }
    if (userRepository.exists(phoneSpec)) {
      errors.put("phone", "Phone is already taken");
    }
    if (!roleRepository.existsById(input.getRoleId())) {
      errors.put("roleId", "Role not found");
    }
    if (!errors.isEmpty()) {
      throw new ApiException(ErrorCode.RESOURCE_EXISTS, errors);
    }
  }

  private void enrich(UserRequest input, User entity) {
    if (input.isEmailVerified() && input.isPhoneVerified()) {
      entity.setStatus(UserStatus.ACTIVE);
    } else {
      entity.setStatus(UserStatus.UNVERIFIED);
    }

    if (input.getAvatarId() != null) {
      var currentAvatar = entity.getAvatar();
      var newAvatarId = input.getAvatarId();

      if (currentAvatar != null) {
        if (currentAvatar.getId().equals(newAvatarId)) {
          return;
        }
        currentAvatar.setUsageStatus(FileUsageStatus.NOT_IN_USE);
        fileRepository.save(currentAvatar);
      }

      var newAvatar =
          fileRepository
              .findOne(
                  (root, _, builder) ->
                      builder.and(
                          builder.equal(root.get("id"), newAvatarId),
                          builder.equal(root.get("purpose"), FilePurpose.AVATAR)))
              .orElseThrow(
                  () -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND, "Avatar not found"));

      if (newAvatar.getUsageStatus() == FileUsageStatus.IN_USE) {
        throw new ApiException(ErrorCode.RESOURCE_EXISTS, ErrorMessageConstants.RESOURCE_AVATAR_IN_USE);
      }

      entity.setAvatar(newAvatar);
      newAvatar.setUsageStatus(FileUsageStatus.IN_USE);
      fileRepository.save(newAvatar);
    }
  }
}
