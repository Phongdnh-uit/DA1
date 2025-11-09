package com.phongdnh.se121.repositories.wish;

import com.phongdnh.se121.entities.wish.Wish;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishRepository extends SimpleRepository<Wish, Long> {}
