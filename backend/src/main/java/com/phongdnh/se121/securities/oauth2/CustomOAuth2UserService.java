package com.phongdnh.se121.securities.oauth2;

import com.phongdnh.se121.entities.authentication.LinkedAccount;
import com.phongdnh.se121.entities.authentication.User;
import com.phongdnh.se121.enums.authentication.UserStatus;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.repositories.authentication.LinkedAccountRepository;
import com.phongdnh.se121.repositories.authentication.UserRepository;
import com.phongdnh.se121.securities.CustomUserDetails;
import jakarta.persistence.criteria.JoinType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.Optional;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@RequiredArgsConstructor
@Component
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
  private final UserRepository userRepository;
  private final LinkedAccountRepository linkedAccountRepository;

  @Override
  public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
    OAuth2User oAuth2User = super.loadUser(userRequest);
    String provider = userRequest.getClientRegistration().getRegistrationId();
    String providerUserId = oAuth2User.getName();
    String email = oAuth2User.getAttribute("email");
    String fullName = oAuth2User.getAttribute("name");

    Optional<LinkedAccount> linkedAccount =
        linkedAccountRepository.findOne(
            (root, _, builder) -> {
              root.fetch("user", JoinType.INNER);
              return builder.and(
                  builder.equal(root.get("provider"), provider),
                  builder.equal(root.get("providerUserId"), providerUserId));
            });
    // Existing linked account
    if (linkedAccount.isPresent()) {
      var user = linkedAccount.get().getUser();
      return CustomUserDetails.builder()
          .id(user.getId())
          .email(user.getEmail())
          .phone(user.getPhone())
          .password(user.getPasswordHash())
          .roleId(user.getRoleId())
          .authorities(Set.of())
          .build();
    }

    // New linked account
    HttpServletRequest request =
        ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
    HttpSession session = request.getSession(false);
    if (session == null || session.getAttribute("verifiedPhone") == null) {
      Throwable cause = new ApiException(ErrorCode.OAUTH2_ERROR, "Phone is not verified");
      throw new OAuth2AuthenticationException(new OAuth2Error("Phone is not verified"), cause);
    }

    String verifiedPhone = (String) session.getAttribute("verifiedPhone");

    User user = null;

    user =
        userRepository
            .findOne((root, _, builder) -> builder.equal(root.get("email"), email))
            .orElse(null);

    if (user == null) {
      user =
          userRepository
              .findOne((root, _, builder) -> builder.equal(root.get("phone"), verifiedPhone))
              .orElse(null);
    }

    if (user == null) {
      user = new User();
      user.setEmail(email);
      user.setPhone(verifiedPhone);
      user.setFullName(fullName);
      user.setRoleId(2L);
      user.setEmailVerified(true);
      user.setPhoneVerified(true);
      user.setStatus(UserStatus.ACTIVE);
      user = userRepository.save(user);
    }

    LinkedAccount newLinkedAccount = new LinkedAccount();
    newLinkedAccount.setProvider(provider);
    newLinkedAccount.setProviderUserId(providerUserId);
    newLinkedAccount.setUser(user);
    linkedAccountRepository.save(newLinkedAccount);

    session.removeAttribute("verifiedPhone");

    return CustomUserDetails.builder()
        .id(user.getId())
        .email(user.getEmail())
        .phone(user.getPhone())
        .password(user.getPasswordHash())
        .roleId(user.getRoleId())
        .authorities(Set.of())
        .attributes(oAuth2User.getAttributes())
        .build();
  }
}
