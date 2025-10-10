package com.phongdnh.se121.repositories.property;

import com.phongdnh.se121.entities.property.Property;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyRepository extends SimpleRepository<Property, Long> {}
