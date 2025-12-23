package com.phongdnh.se121.repositories.general;

import com.phongdnh.se121.entities.general.File;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends SimpleRepository<File, Long> {}
