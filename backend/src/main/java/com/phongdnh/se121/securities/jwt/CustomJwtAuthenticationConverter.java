package com.phongdnh.se121.securities.jwt;

import com.phongdnh.se121.entities.authentication.User;
import com.phongdnh.se121.repositories.authentication.UserRepository;
import com.phongdnh.se121.securities.CustomUserDetails;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class CustomJwtAuthenticationConverter
    implements Converter<Jwt, AbstractAuthenticationToken> {

  private final UserRepository userRepository;

  // private final JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter;

  @Override
  public AbstractAuthenticationToken convert(Jwt jwt) {
    // Collection<? extends GrantedAuthority> jwtAuthorities =
    //     jwtGrantedAuthoritiesConverter.convert(jwt);
    // Set<? extends GrantedAuthority> authorities =
    //     jwtAuthorities == null
    //         ? Collections.emptySet()
    //         : Collections.unmodifiableSet(Set.copyOf(jwtAuthorities));

    Long userId = null;
    try {
      userId = Long.parseLong(jwt.getSubject());
    } catch (NumberFormatException e) {
      throw new JwtException("Invalid user ID in JWT subject", e);
    }
    User user =
        userRepository.findById(userId).orElseThrow(() -> new JwtException("User not found"));

    CustomUserDetails principal =
        CustomUserDetails.builder()
            .id(user.getId())
            .email(user.getEmail())
            .phone(user.getPhone())
            .password(user.getPasswordHash())
            .roleId(user.getRoleId())
            .authorities(Set.of())
            .build();
    return new UsernamePasswordAuthenticationToken(principal, jwt, principal.getAuthorities());
  }
}
