package com.phongdnh.se121.entities.general;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.general.FilePurpose;
import com.phongdnh.se121.enums.general.FileStatus;
import com.phongdnh.se121.enums.general.FileUsageStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "files")
public class File extends BaseEntity {
  @Column(nullable = false)
  private String originalName;

  @Column(nullable = false, unique = true)
  private String objectName; // AWS3 Object name

  private String mimeType;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private FilePurpose purpose;

  // For business use
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private FileUsageStatus usageStatus = FileUsageStatus.NOT_IN_USE;

  // For technical use only
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private FileStatus status;
}
