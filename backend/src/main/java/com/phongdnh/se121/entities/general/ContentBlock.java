package com.phongdnh.se121.entities.general;

import com.fasterxml.jackson.databind.JsonNode;
import com.phongdnh.se121.entities.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Entity
@Table(name = "content_blocks")
public class ContentBlock extends BaseEntity {
  // May be null if the content block has no associated file
  @OneToOne
  @JoinColumn(name = "file_id")
  private File file;

  // May be null if the content block has no associated metadata
  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "JSON")
  private JsonNode metadata;
  // Ensure if file and metadata are both null, then entity must not be persisted
}
