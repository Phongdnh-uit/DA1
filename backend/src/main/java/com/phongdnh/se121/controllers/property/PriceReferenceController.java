package com.phongdnh.se121.controllers.property;

import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.property.PriceReferenceResponse;
import com.phongdnh.se121.entities.property.PriceReference;
import com.phongdnh.se121.services.property.PriceReferenceService;
import io.github.perplexhub.rsql.RSQLJPASupport;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Price Reference")
@RequestMapping("/price-references")
@RequiredArgsConstructor
@RestController
public class PriceReferenceController {
  private final PriceReferenceService priceReferenceService;

  @GetMapping
  public ResponseEntity<ApiResponse<PageResponse<PriceReferenceResponse>>> getPriceReferences(
      @ParameterObject Pageable pageable,
      @RequestParam(required = false, value = "filter") String filter,
      @RequestParam(required = false, value = "all", defaultValue = "false") boolean all) {
    if (all) {
      pageable = Pageable.unpaged(pageable.getSort());
    }
    Specification<PriceReference> specification = RSQLJPASupport.toSpecification(filter);
    return ResponseEntity.ok(
        ApiResponse.ok(priceReferenceService.findAllPriceReferences(pageable, specification)));
  }
}
