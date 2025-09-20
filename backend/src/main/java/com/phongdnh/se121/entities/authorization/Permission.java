package com.phongdnh.se121.entities.authorization;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.authorization.Action;
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
@Table(name = "permissions")
public class Permission extends BaseEntity {

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String resource;

  @Enumerated(EnumType.STRING)
  private Action action;
}
