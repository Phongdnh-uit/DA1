package com.phongdnh.se121.entities.property;

import com.phongdnh.se121.entities.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "property_types")
public class PropertyType extends BaseEntity {
  // @Column(nullable = false, unique = true)
  private String name;
}
