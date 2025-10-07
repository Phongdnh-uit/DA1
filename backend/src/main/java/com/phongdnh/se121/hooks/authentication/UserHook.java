package com.phongdnh.se121.hooks.authentication;

import com.phongdnh.se121.dtos.authentication.UserRequest;
import com.phongdnh.se121.dtos.authentication.UserResponse;
import com.phongdnh.se121.entities.authentication.User;
import com.phongdnh.se121.enums.authentication.UserStatus;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.hooks.DefaultHook;
import com.phongdnh.se121.repositories.authentication.UserRepository;
import com.phongdnh.se121.repositories.authorization.RoleRepository;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class UserHook extends DefaultHook<User, Long, UserRequest, UserResponse> {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final RoleRepository roleRepository;

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
  }
}
