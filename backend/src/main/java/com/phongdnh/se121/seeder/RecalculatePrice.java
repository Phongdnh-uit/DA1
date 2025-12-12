package com.phongdnh.se121.seeder;

import com.phongdnh.se121.services.property.PriceReferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RecalculatePrice implements ApplicationRunner {

  private final PriceReferenceService priceReferenceService;

  @Override
  public void run(ApplicationArguments args) throws Exception {
    // priceReferenceService.batchUpdatePriceReferences();
  }
}
