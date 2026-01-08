package com.phongdnh.se121.entities.property;

import com.phongdnh.se121.entities.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.SoftDelete;

@Getter
@Setter
@SoftDelete(columnName = "is_deleted")
@SQLRestriction(value = "is_deleted = false")
@Entity
@Table(name = "property_types")
public class PropertyType extends BaseEntity {
  // @Column(nullable = false, unique = true)
  private String name;

  @OneToMany(mappedBy = "type", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Property> properties = new ArrayList<>();
}
