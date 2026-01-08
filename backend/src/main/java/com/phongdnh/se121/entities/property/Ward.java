package com.phongdnh.se121.entities.property;

import com.phongdnh.se121.entities.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "wards")
public class Ward extends BaseEntity {
  @Column(nullable = false)
  private String name;

  @Column(nullable = false, unique = true)
  private String code;

  @Column(nullable = false, unique = true)
  private String type;

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumn(name = "province_id")
  private Province province;

  @OneToMany(
      mappedBy = "ward",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<Property> properties = new ArrayList<>();
}
