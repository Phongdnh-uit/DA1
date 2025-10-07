package com.phongdnh.se121.repositories.property;

import com.phongdnh.se121.entities.property.District;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DistrictRepository extends SimpleRepository<District, Long> {}
