package com.phongdnh.se121.repositories.booking;

import com.phongdnh.se121.entities.booking.Booking;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends SimpleRepository<Booking, Long> {}
