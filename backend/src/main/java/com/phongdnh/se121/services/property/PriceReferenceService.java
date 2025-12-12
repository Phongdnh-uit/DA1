package com.phongdnh.se121.services.property;

import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.property.PriceReferenceResponse;
import com.phongdnh.se121.entities.property.PriceReference;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface PriceReferenceService {

  PageResponse<PriceReferenceResponse> findAllPriceReferences(
      Pageable pageable, Specification<PriceReference> specification);

  void batchUpdatePriceReferences();
}
