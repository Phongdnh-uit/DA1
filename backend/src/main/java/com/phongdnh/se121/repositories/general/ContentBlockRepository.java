package com.phongdnh.se121.repositories.general;

import com.phongdnh.se121.entities.general.ContentBlock;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentBlockRepository extends SimpleRepository<ContentBlock, Long> {}
