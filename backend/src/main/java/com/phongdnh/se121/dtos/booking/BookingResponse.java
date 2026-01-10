package com.phongdnh.se121.dtos.booking;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.booking.BookingStatus;
import com.phongdnh.se121.enums.booking.BookingType;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingResponse extends BaseEntity {
  private String name;

  private String email;

  private String phone;

  private BookingType type;

  private String note;

  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate date;

  @JsonFormat(pattern = "HH:mm")
  private LocalTime time;

  private BookingStatus status;
}
