package com.phongdnh.se121.services.property;

import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.property.PriceReferenceResponse;
import com.phongdnh.se121.entities.property.PriceReference;
import com.phongdnh.se121.mappers.property.PriceReferenceMapper;
import com.phongdnh.se121.projections.PriceReferenceProjection;
import com.phongdnh.se121.repositories.property.PriceReferenceRepository;
import com.phongdnh.se121.repositories.property.PropertyRepository;
import com.phongdnh.se121.repositories.property.PropertyTypeRepository;
import com.phongdnh.se121.repositories.property.WardRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class PriceReferenceServiceImpl implements PriceReferenceService {
  private final PriceReferenceRepository priceReferenceRepository;
  private final WardRepository wardRepository;
  private final PropertyTypeRepository propertyTypeRepository;
  private final PropertyRepository propertyRepository;
  private final PriceReferenceMapper priceReferenceMapper;

  @Override
  public PageResponse<PriceReferenceResponse> findAllPriceReferences(
      Pageable pageable, Specification<PriceReference> specification) {
    var page = priceReferenceRepository.findAll(specification, pageable);
    return PageResponse.fromPage(page.map(priceReferenceMapper::entityToResponse));
  }

  @Scheduled(cron = "0 0 0 * * ?")
  @Async
  @Override
  public void batchUpdatePriceReferences() {
    log.info("Start batch updating price references...");

    List<PriceReferenceProjection> projections = propertyRepository.aggregatePriceReferences();

    List<PriceReference> listToSave = new ArrayList<>();

    for (PriceReferenceProjection projection : projections) {
      PriceReference priceReference = new PriceReference();
      priceReference.setPropertyType(
          propertyTypeRepository.getReferenceById(projection.getTypeId()));
      priceReference.setWard(wardRepository.getReferenceById(projection.getWardId()));
      priceReference.setAveragePrice(projection.getAveragePrice());
      priceReference.setMinPrice(projection.getMinPrice());
      priceReference.setMaxPrice(projection.getMaxPrice());
      priceReference.setCount(projection.getCount());

      listToSave.add(priceReference);
    }

    // Save all updated references
    priceReferenceRepository.saveAll(listToSave);
    log.info("Finished batch updating price references.");
  }
}
