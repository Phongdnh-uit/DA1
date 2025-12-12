package com.phongdnh.se121.mappers.booking;

import com.phongdnh.se121.dtos.booking.BookingRequest;
import com.phongdnh.se121.dtos.booking.BookingResponse;
import com.phongdnh.se121.entities.booking.Booking;
import com.phongdnh.se121.mappers.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BookingMapper extends GenericMapper<Booking, BookingRequest, BookingResponse> {

  @Mapping(target = "status", source = "status", ignore = true)
  @Override
  Booking requestToEntity(BookingRequest request);
}
