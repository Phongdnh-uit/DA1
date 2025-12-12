package com.phongdnh.se121.entities.general;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.general.FileStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

  @Column(nullable = false)
  private FileStatus status;
}
