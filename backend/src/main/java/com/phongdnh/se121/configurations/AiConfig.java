package com.phongdnh.se121.configurations;

import org.springframework.ai.transformer.splitter.TextSplitter;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

  @Bean
  TextSplitter tokenTextSplitter() {
    return TokenTextSplitter.builder().withChunkSize(500).build();
  }
}
