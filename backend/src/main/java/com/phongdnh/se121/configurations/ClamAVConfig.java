package com.phongdnh.se121.configurations;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import xyz.capybara.clamav.ClamavClient;

@Configuration
public class ClamAVConfig {
  @Value("${clamav.host}")
  private String clamAVHost;

  @Value("${clamav.port}")
  private int clamAVPort;

  @Bean
  ClamavClient clamavClient() {
    return new ClamavClient(clamAVHost, clamAVPort);
  }
}
