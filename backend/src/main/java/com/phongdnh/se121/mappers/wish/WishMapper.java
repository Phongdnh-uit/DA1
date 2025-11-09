package com.phongdnh.se121.mappers.wish;

import com.phongdnh.se121.dtos.wish.WishRequest;
import com.phongdnh.se121.dtos.wish.WishResponse;
import com.phongdnh.se121.entities.wish.Wish;
import com.phongdnh.se121.mappers.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface WishMapper extends GenericMapper<Wish, WishRequest, WishResponse> {}
