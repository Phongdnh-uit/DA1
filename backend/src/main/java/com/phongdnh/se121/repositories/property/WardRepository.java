package com.phongdnh.se121.repositories.property;

import com.phongdnh.se121.entities.property.Ward;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WardRepository extends SimpleRepository<Ward, Long> {}
