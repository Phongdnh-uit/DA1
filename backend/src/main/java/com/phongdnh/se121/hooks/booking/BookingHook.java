package com.phongdnh.se121.hooks.booking;

import com.phongdnh.se121.dtos.booking.BookingRequest;
import com.phongdnh.se121.dtos.booking.BookingResponse;
import com.phongdnh.se121.entities.booking.Booking;
import com.phongdnh.se121.enums.booking.BookingStatus;
import com.phongdnh.se121.hooks.GenericHook;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class BookingHook implements GenericHook<Booking, Long, BookingRequest, BookingResponse> {

  @Override
  public void enrichCreate(BookingRequest input, Booking entity, Map<String, Object> context) {
    entity.setStatus(BookingStatus.PENDING);
  }
}
