package com.phongdnh.se121.repositories.property;

import com.phongdnh.se121.entities.property.PriceReference;
import com.phongdnh.se121.repositories.SimpleRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

@Repository
public interface PriceReferenceRepository extends SimpleRepository<PriceReference, Long> {

  @EntityGraph(attributePaths = {"ward", "propertyType"})
  @Override
  Optional<PriceReference> findOne(Specification<PriceReference> spec);

  @Override
  @EntityGraph(attributePaths = {"ward", "propertyType"})
  Page<PriceReference> findAll(Specification<PriceReference> spec, Pageable pageable);

  @EntityGraph(attributePaths = {"ward", "propertyType"})
  List<PriceReference> findAll();
}
