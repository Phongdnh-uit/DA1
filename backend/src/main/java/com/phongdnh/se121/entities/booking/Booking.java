package com.phongdnh.se121.entities.booking;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.booking.BookingStatus;
import com.phongdnh.se121.enums.booking.BookingType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "bookings")
public class Booking extends BaseEntity {
  @Column(nullable = false)
  private String name;

  private String email;

  @Column(nullable = false)
  private String phone;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private BookingType type;

  private String note;

  @Column(nullable = false)
  private LocalDate date;

  @Column(nullable = false)
  private LocalTime time;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private BookingStatus status;
}
