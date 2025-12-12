package com.phongdnh.se121.repositories.property;

import com.phongdnh.se121.entities.property.Province;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProvinceRepository extends SimpleRepository<Province, Long> {}
