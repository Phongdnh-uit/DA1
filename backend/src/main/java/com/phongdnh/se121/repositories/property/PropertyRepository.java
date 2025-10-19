package com.phongdnh.se121.repositories.property;

import com.phongdnh.se121.entities.property.Property;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyRepository extends SimpleRepository<Property, Long> {

  @EntityGraph(attributePaths = {"type", "ward", "ward.province"})
  @Override
  Page<Property> findAll(Specification<Property> spec, Pageable pageable);
}
