package com.phongdnh.se121.enums.general;

import java.util.Set;
import lombok.Getter;

@Getter
public enum FilePurpose {
  PROPERTY_FILE(
      Set.of(
          "image/png",
          "image/jpg",
          "image/jpeg",
          "application/pdf",
          "application/msword", // .doc
          "application/wps-office.doc", // .doc (WPS)
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
          "application/vnd.ms-excel", // .xls
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
          "text/csv", // .csv
          "video/mp4",
          "video/mov")),

  PROPERTY_THUMBNAIL(Set.of("image/png", "image/jpg", "image/jpeg")),

  PROPERTY_GALLERY(Set.of("image/png", "image/jpg", "image/jpeg", "video/mp4", "video/mov")),

  CHAT_FILE(
      Set.of(
          "image/png",
          "image/jpg",
          "image/jpeg",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/csv",
          "application/zip",
          "video/mp4",
          "video/mpeg",
          "audio/mpeg",
          "audio/wav")),
  AVATAR(Set.of("image/png", "image/jpg", "image/jpeg")),

  CAROUSEL_IMAGE(Set.of("image/png", "image/jpg", "image/jpeg"));

  private final Set<String> allowedTypes;

  FilePurpose(Set<String> allowedTypes) {
    this.allowedTypes = allowedTypes;
  }
}
