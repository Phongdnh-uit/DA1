package com.phongdnh.se121.entities.authorization;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.authorization.Method;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;
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

  @Column(nullable = false)
  private String urlPattern;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private Method method;

  @Column(nullable = false, unique = true, length = 100)
  private String code;

  @ManyToMany(mappedBy = "permissions", fetch = FetchType.LAZY)
  private Set<Role> roles = new HashSet<>();
}
