package com.phongdnh.se121.repositories.property;

import com.phongdnh.se121.entities.property.PropertyType;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyTypeRepository extends SimpleRepository<PropertyType, Long> {}
