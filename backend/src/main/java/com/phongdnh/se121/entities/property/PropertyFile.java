package com.phongdnh.se121.entities.property;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.entities.general.File;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "property_files")
public class PropertyFile extends BaseEntity {
  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "property_id", nullable = false)
  private Property property;

  // Use service to handle delete file, ensure consistency between minIO and database
  @OneToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "file_id", nullable = false)
  private File file;
}
