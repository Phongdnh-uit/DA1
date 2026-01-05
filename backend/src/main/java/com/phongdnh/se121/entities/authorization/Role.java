package com.phongdnh.se121.entities.authorization;

import com.phongdnh.se121.entities.BaseEntity;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;
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

  private boolean isDefault = false;

  private boolean canManage = false;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "role_permissions",
      joinColumns = @JoinColumn(name = "role_id"),
      inverseJoinColumns = @JoinColumn(name = "permission_id"))
  private Set<Permission> permissions = new HashSet<>();

  // Trễ deadline nên modules hiển thị sẽ do ui quyết định
  // Chỉ lưu nhanh các module mà role có quyền truy cập
  @ElementCollection
  @CollectionTable(name = "role_modules", joinColumns = @JoinColumn(name = "role_id"))
  @Column(name = "module_name")
  private Set<String> accessibleModules = new HashSet<>();
}
