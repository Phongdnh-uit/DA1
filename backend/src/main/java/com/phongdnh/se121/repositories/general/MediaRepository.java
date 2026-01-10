package com.phongdnh.se121.repositories.general;

import com.phongdnh.se121.entities.general.Media;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MediaRepository extends SimpleRepository<Media, Long> {}
