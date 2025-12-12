package com.phongdnh.se121.dtos.booking;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.phongdnh.se121.annotations.ValidPhone;
import com.phongdnh.se121.dtos.Action.Update;
import com.phongdnh.se121.enums.booking.BookingStatus;
import com.phongdnh.se121.enums.booking.BookingType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingRequest {
  @NotBlank private String name;

  @Email private String email;

  @NotBlank @ValidPhone private String phone;

  @NotNull private BookingType type;

  private String note;

  @NotNull
  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate date;

  @NotNull
  @JsonFormat(pattern = "HH:mm")
  private LocalTime time;

  @NotNull(groups = {Update.class})
  private BookingStatus status;
}
