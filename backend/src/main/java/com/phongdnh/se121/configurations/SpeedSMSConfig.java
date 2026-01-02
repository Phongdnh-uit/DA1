package com.phongdnh.se121.configurations;

import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class SpeedSMSConfig {

  @Value("${speedsms.api-url}")
  private String apiUrl;

  @Value("${speedsms.access-token}")
  private String accessToken;

    @Bean(name = "speedSMSRestClient")
    RestClient speedSMSRestClient() {
        String userCredentials = accessToken + ":x";
        String basicAuth = "Basic " + Base64.getEncoder().encodeToString(userCredentials.getBytes());
        return RestClient.builder()
        .baseUrl(apiUrl)
        .defaultHeader("Authorization", basicAuth)
        .defaultHeader("Content-Type", "application/json")
        .build();
    }


}
