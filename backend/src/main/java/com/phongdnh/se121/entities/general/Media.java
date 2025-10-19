package com.phongdnh.se121.entities.general;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.general.MediaEntityType;
import com.phongdnh.se121.enums.general.MediaPurpose;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(
    name = "medias",
    indexes = {@Index(name = "idx_entity", columnList = "entity_type, entity_id")})
public class Media extends BaseEntity {
  @Column(nullable = false)
  private String publicId;

  @Column(nullable = false)
  private String secureUrl;

  @Column(nullable = false)
  private String format;

  @Column(nullable = false)
  private String resourceType;

  @Column(nullable = false)
  private Integer width;

  @Column(nullable = false)
  private Integer height;

  @Column(nullable = false)
  private Integer bytes;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private MediaPurpose purpose;

  @Enumerated(EnumType.STRING)
  private MediaEntityType entityType;

  private Long entityId;
}
