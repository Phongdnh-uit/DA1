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
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer {

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  @Order(2)
  SecurityFilterChain filterChain(
      HttpSecurity http,
      CustomJwtAuthenticationConverter jwtConverter,
      CustomAuthenticationEntryPoint entryPoint)
      throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .cors(Customizer.withDefaults())
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers(SecurityConstant.PUBLIC_URLS)
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/properties/all").permitAll()
                    .anyRequest()
                    .authenticated())
        .oauth2ResourceServer(
            oauth2 ->
                oauth2
                    .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtConverter))
                    .authenticationEntryPoint(entryPoint))
        .formLogin(AbstractHttpConfigurer::disable)
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    return http.build();
  }

  @Bean
  @Order(1)
  SecurityFilterChain oauth2LoginChain(
      HttpSecurity http,
      OAuth2SuccessHandler oAuth2SuccessHandler,
      OAuth2FailureHandler oAuth2FailureHandler,
      CustomOAuth2UserService oAuth2UserService,
      CustomAuthorizationRequestResolver authorizationRequestResolver)
      throws Exception {
    http.securityMatcher(
            AppConstant.OAUTH2_AUTHORIZATION_BASE_URI + "/**",
            AppConstant.OAUTH2_AUTHORIZATION_CALLBACK_URI + "/**")
        .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
        .formLogin(AbstractHttpConfigurer::disable)
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
        .csrf(AbstractHttpConfigurer::disable)
        .cors(Customizer.withDefaults());
    return http.build();
  }
}
