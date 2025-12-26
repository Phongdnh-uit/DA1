package com.phongdnh.se121.seeder;

import com.phongdnh.se121.services.file.FileOrchestratorService;
import com.phongdnh.se121.services.property.PriceReferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class CrobjobRunner implements ApplicationRunner {
  private final FileOrchestratorService fileOrchestratorService;
  private final PriceReferenceService priceReferenceService;

  // Active all cronjob on startup
  @Override
  public void run(ApplicationArguments args) throws Exception {
    fileOrchestratorService.cronjobCleanupOrphanedFiles();
    priceReferenceService.batchUpdatePriceReferences();
  }
}
