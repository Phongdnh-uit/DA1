package com.phongdnh.se121.entities.authorization;

import com.phongdnh.se121.entities.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "roles")
public class Role extends BaseEntity {
  @Column(unique = true, nullable = false)
  private String name;

  private String description;
}
