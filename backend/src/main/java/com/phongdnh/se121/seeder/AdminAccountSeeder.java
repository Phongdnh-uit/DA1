package com.phongdnh.se121.seeder;

import com.phongdnh.se121.entities.authentication.User;
import com.phongdnh.se121.enums.authentication.UserStatus;
import com.phongdnh.se121.repositories.authentication.UserRepository;
import com.phongdnh.se121.repositories.authorization.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class AdminAccountSeeder implements ApplicationRunner {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final RoleRepository roleRepository;

  @Value("${app.bootstrap.admin.phone}")
  private String adminPhone;

  @Value("${app.bootstrap.admin.password}")
  private String adminPassword;

  @Value("${app.bootstrap.admin.email}")
  private String adminEmail;

  @Value("${app.bootstrap.admin.force-recreate:false}")
  private boolean forceRecreateAdmin;

  @Override
  public void run(ApplicationArguments args) throws Exception {
    if (!isValidateBeforeCreateAdmin()) {
      return;
    }
    User user = new User();
    user.setEmail(adminEmail);
    user.setPhone(adminPhone);
    user.setPasswordHash(passwordEncoder.encode(adminPassword));
    user.setFullName("Administrator");
    user.setEmailVerified(true);
    user.setPhoneVerified(true);
    // Trễ deadline tạm gán cứng role admin id = 1
    user.setRole(roleRepository.getReferenceById(1L));
    user.setStatus(UserStatus.ACTIVE);
    userRepository.save(user);
    log.info("Admin account created with phone: {} and email: {}", adminPhone, adminEmail);
  }

  private boolean isValidateBeforeCreateAdmin() {
    // Log warning if force recreate admin is enabled
    if (forceRecreateAdmin) {
      log.warn(
          "Force recreate admin is enabled. Existing admin account will be deleted if exists.");
    }

    if (userRepository.exists(
        (root, _, builder) ->
            builder.or(
                builder.equal(root.get("phone"), adminPhone),
                builder.equal(root.get("email"), adminEmail)))) {
      log.warn("Admin account with phone {} or email {} already exists.", adminPhone, adminEmail);
      if (!forceRecreateAdmin) {
        log.warn("Skipping admin account creation. To recreate, enable forceRecreateAdmin.");
        return false;
      }
    } else {
      return true;
    }

    userRepository.delete(
        (root, _, builder) ->
            builder.or(
                builder.equal(root.get("phone"), adminPhone),
                builder.equal(root.get("email"), adminEmail)));
    return true;
  }
}
