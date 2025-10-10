package com.phongdnh.se121.entities.property;

import com.phongdnh.se121.entities.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "provinces")
public class Province extends BaseEntity {
  @Column(nullable = false)
  private String name;

  @Column(nullable = false, unique = true)
  private String phoneCode;

  @Column(nullable = false, unique = true)
  private String codeName;

  @Column(nullable = false)
  private String divisionType;
}
