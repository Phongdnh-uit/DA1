package com.phongdnh.se121.configurations;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.util.Base64;
import com.phongdnh.se121.constants.ErrorMessageConstants;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

@Configuration
public class JwtConfig {

  public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;

  @Value("${jwt.secret}")
  private String secret;

  @Bean
  JwtEncoder jwtEncoder() {
    return new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
  }

  @Bean
  JwtDecoder jwtDecoder() {
    NimbusJwtDecoder decoder =
        NimbusJwtDecoder.withSecretKey(getSecretKey()).macAlgorithm(JWT_ALGORITHM).build();
    return token -> {
      return decoder.decode(token);
    };
  }

  private SecretKey getSecretKey() {
    byte[] keyBytes = Base64.from(secret).decode();
    if (keyBytes.length < 64) {
      throw new IllegalArgumentException(ErrorMessageConstants.SYSTEM_HS512_SECRET_KEY_TOO_SHORT);
    }
    return new SecretKeySpec(keyBytes, 0, keyBytes.length, JWT_ALGORITHM.getName());
  }
}
