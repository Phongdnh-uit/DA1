package com.phongdnh.se121.configurations;

import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiDocConfig {
  @Bean
  OpenApiCustomizer operationIdCustomizer() {
    return openApi -> {
      openApi
          .getPaths()
          .values()
          .forEach(
              (item) -> {
                item.readOperations()
                    .forEach(
                        operation -> {
                          String operationId = operation.getOperationId();
                          if (operationId != null) {
                            String entityName =
                                operation.getTags().isEmpty()
                                    ? "Unknown"
                                    : operation.getTags().get(0).replaceAll("\\s+", "");
                            operation.setOperationId(operationId.replace("{Resource}", entityName));
                          }
                        });
              });
    };
  }
}
