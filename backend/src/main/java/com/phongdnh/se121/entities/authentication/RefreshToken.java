package com.phongdnh.se121.entities.authentication;

import com.phongdnh.se121.entities.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken extends BaseEntity {

  private String token;

  private Long userId;

  private Instant expiresAt;
}
