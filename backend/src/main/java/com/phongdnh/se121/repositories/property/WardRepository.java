package com.phongdnh.se121.repositories.property;

import com.phongdnh.se121.entities.property.Ward;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

@Repository
public interface WardRepository extends SimpleRepository<Ward, Long> {

  @EntityGraph(attributePaths = {"province"})
  @Override
  Page<Ward> findAll(
      @Nullable Specification<Ward> spec,
      @Nullable Specification<Ward> countSpec,
      Pageable pageable);
}
