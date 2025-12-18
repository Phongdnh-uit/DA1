package com.phongdnh.se121.repositories.authentication;

import com.phongdnh.se121.entities.authentication.User;
import com.phongdnh.se121.repositories.SimpleRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends SimpleRepository<User, Long> {

  @EntityGraph(attributePaths = {"avatar"})
  @Override
  Page<User> findAll(Specification<User> spec, Pageable pageable);

  @Query(
      value =
"""
    SELECT
        CASE
            WHEN :granularity = 'DAILY' THEN DATE_FORMAT(u.createdAt, '%d-%m-%Y')
            WHEN :granularity = 'WEEKLY' THEN DATE_FORMAT(u.createdAt, 'W%v-%x')
            WHEN :granularity = 'MONTHLY' THEN DATE_FORMAT(u.createdAt, '%m-%Y')
            WHEN :granularity = 'YEARLY' THEN DATE_FORMAT(u.createdAt, '%Y')
        END AS period,
        COUNT(u.id) AS userCount
    FROM User u
    WHERE u.createdAt BETWEEN :startDate AND :endDate
    GROUP BY period
    ORDER BY period ASC
""")
  List<Object[]> countUsersGroupedByCreatedAtBetween(
      @Param("startDate") Instant startDate,
      @Param("endDate") Instant endDate,
      @Param("granularity") String granularity);
}
