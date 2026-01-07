package com.phongdnh.se121.securities;

import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.phongdnh.se121.entities.authentication.User;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.repositories.authentication.UserRepository;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class CustomUserDetailsService implements UserDetailsService {
  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String credential) throws UsernameNotFoundException {
    // 1. ---- Username: phone or email ----
    PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
    boolean isPhone = phoneUtil.isPossibleNumber(credential, "VN");
    User user;
    if (isPhone) {
      user =
          userRepository
              .findOne((root, _, builder) -> builder.equal(root.get("phone"), credential))
              .orElseThrow(() -> new ApiException(ErrorCode.INVALID_CREDENTIALS));
    } else {
      user =
          userRepository
              .findOne((root, _, builder) -> builder.equal(root.get("email"), credential))
              .orElseThrow(() -> new ApiException(ErrorCode.INVALID_CREDENTIALS));
    }
    return CustomUserDetails.builder()
        .id(user.getId())
        .email(user.getEmail())
        .phone(user.getPhone())
        .fullName(user.getFullName())
        .password(user.getPasswordHash())
        .roleId(user.getRole().getId())
        .authorities(Set.of())
        .build();
  }
}
