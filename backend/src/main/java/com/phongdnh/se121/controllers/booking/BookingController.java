package com.phongdnh.se121.controllers.booking;

import com.phongdnh.se121.controllers.GenericController;
import com.phongdnh.se121.dtos.booking.BookingRequest;
import com.phongdnh.se121.dtos.booking.BookingResponse;
import com.phongdnh.se121.entities.booking.Booking;
import com.phongdnh.se121.services.CrudService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Booking")
@RequestMapping("/bookings")
@RestController
public class BookingController
    extends GenericController<Booking, Long, BookingRequest, BookingResponse> {

  public BookingController(CrudService<Booking, Long, BookingRequest, BookingResponse> service) {
    super(service);
  }
}
