package com.phongdnh.se121.repositories.property;

import com.phongdnh.se121.entities.property.Property;
import com.phongdnh.se121.repositories.SimpleRepository;
import java.time.Instant;
import java.util.List;
import org.locationtech.jts.geom.Point;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyRepository extends SimpleRepository<Property, Long> {

  @EntityGraph(attributePaths = {"type", "ward", "ward.province"})
  @Override
  Page<Property> findAll(Specification<Property> spec, Pageable pageable);

  @Query(
      """
      SELECT CASE
            WHEN :granularity = 'DAILY' THEN DATE_FORMAT(p.createdAt, '%d-%m-%Y')
            WHEN :granularity = 'WEEKLY' THEN DATE_FORMAT(p.createdAt, 'W%v-%x')
            WHEN :granularity = 'MONTHLY' THEN DATE_FORMAT(p.createdAt, '%m-%Y')
            WHEN :granularity = 'YEARLY' THEN DATE_FORMAT(p.createdAt, '%Y')
             END AS period,
             COUNT(p.id) AS propertyCount
      FROM Property p
      WHERE p.createdAt BETWEEN :startDate AND :endDate
      GROUP BY period
      ORDER BY period ASC
      """)
  List<Object[]> countPropertiesGroupedByCreatedAtBetween(
      @Param("startDate") Instant startDate,
      @Param("endDate") Instant endDate,
      @Param("granularity") String granularity);

  @EntityGraph(attributePaths = {"type", "ward", "ward.province"})
  @Query(
      "SELECT p FROM Property p WHERE function('ST_Distance_Sphere', p.location, :point) <="
          + " :distance")
  List<Property> findWithinDistance(
      @Param("point") Point point, @Param("distance") double distance);
}
