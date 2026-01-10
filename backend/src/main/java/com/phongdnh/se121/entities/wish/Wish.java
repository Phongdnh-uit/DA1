package com.phongdnh.se121.entities.wish;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.entities.authentication.User;
import com.phongdnh.se121.enums.wish.WishType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "wishes")
public class Wish extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false)
  private Long identifier;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private WishType type;
}
