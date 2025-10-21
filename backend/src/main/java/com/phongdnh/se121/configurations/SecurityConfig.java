package com.phongdnh.se121.configurations;

import com.phongdnh.se121.constants.AppConstant;
import com.phongdnh.se121.constants.SecurityConstant;
import com.phongdnh.se121.securities.CustomAuthenticationEntryPoint;
import com.phongdnh.se121.securities.jwt.CustomJwtAuthenticationConverter;
import com.phongdnh.se121.securities.oauth2.CustomAuthorizationRequestResolver;
import com.phongdnh.se121.securities.oauth2.CustomOAuth2UserService;
import com.phongdnh.se121.securities.oauth2.OAuth2FailureHandler;
import com.phongdnh.se121.securities.oauth2.OAuth2SuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SecurityConfig implements WebMvcConfigurer {

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  SecurityFilterChain filterChain(
      HttpSecurity http,
      CustomJwtAuthenticationConverter jwtConverter,
      CustomOAuth2UserService oAuth2UserService,
      CustomAuthorizationRequestResolver authorizationRequestResolver,
      OAuth2SuccessHandler oAuth2SuccessHandler,
      OAuth2FailureHandler oAuth2FailureHandler,
      CustomAuthenticationEntryPoint entryPoint)
      throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers(SecurityConstant.PUBLIC_URLS)
                    .permitAll()
                    .anyRequest()
                    .authenticated())
        .formLogin(AbstractHttpConfigurer::disable)
        .oauth2ResourceServer(
            oauth2 ->
                oauth2
                    .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtConverter))
                    .authenticationEntryPoint(entryPoint))
        .oauth2Login(
            oauth2 ->
                oauth2
                    .authorizationEndpoint(
                        endpoint ->
                            endpoint
                                .baseUri(AppConstant.OAUTH2_AUTHORIZATION_BASE_URI)
                                .authorizationRequestResolver(authorizationRequestResolver))
                    .redirectionEndpoint(
                        endpoint -> endpoint.baseUri(AppConstant.OAUTH2_AUTHORIZATION_CALLBACK_URI))
                    .userInfoEndpoint(userInfo -> userInfo.userService(oAuth2UserService))
                    .successHandler(oAuth2SuccessHandler)
                    .failureHandler(oAuth2FailureHandler))
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .exceptionHandling(ex -> ex.authenticationEntryPoint(entryPoint));
    return http.build();
  }
}
