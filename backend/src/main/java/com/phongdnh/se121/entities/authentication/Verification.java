package com.phongdnh.se121.entities.authentication;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.authentication.VerificationType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "verifications")
public class Verification extends BaseEntity {
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private VerificationType type;

  @Column(unique = true, nullable = false)
  private String code;

  @Column(nullable = false)
  private Instant expiresAt;

  @Column(nullable = false)
  private Long userId;
}
