package com.phongdnh.se121.hooks.wish;

import com.phongdnh.se121.dtos.wish.WishRequest;
import com.phongdnh.se121.dtos.wish.WishResponse;
import com.phongdnh.se121.entities.wish.Wish;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.hooks.DefaultHook;
import com.phongdnh.se121.repositories.authentication.UserRepository;
import com.phongdnh.se121.repositories.wish.WishRepository;
import com.phongdnh.se121.securities.SecurityUtil;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class WishHook extends DefaultHook<Wish, Long, WishRequest, WishResponse> {

  private final WishRepository wishRepository;
  private final UserRepository userRepository;

  @Override
  public void validateCreate(WishRequest input, Map<String, Object> context) {
    validate(input, null);
  }

  @Override
  public void validateUpdate(
      Long id, WishRequest input, Wish existingEntity, Map<String, Object> context) {
    validate(input, id);
  }

  @Override
  public void enrichCreate(WishRequest input, Wish entity, Map<String, Object> context) {
    enrich(entity);
  }

  @Override
  public void enrichUpdate(WishRequest input, Wish entity, Map<String, Object> context) {
    enrich(entity);
  }

  // ============================ HELPER METHOD ============================
  private void validate(WishRequest input, Long id) {
    // 1. ---- Check if wish exists ----
    Specification<Wish> spec =
        (root, _, builder) ->
            builder.and(
                builder.equal(root.get("type"), input.getType()),
                builder.equal(root.get("identifier"), input.getIdentifier()));
    if (id != null) {
      spec = spec.and((root, _, builder) -> builder.notEqual(root.get("id"), id));
    }

    if (wishRepository.exists(spec)) {
      throw new ApiException(ErrorCode.RESOURCE_EXISTS);
    }
  }

  private void enrich(Wish entity) {
    Long userId = SecurityUtil.getCurrentUserId();
    entity.setUser(userRepository.getReferenceById(userId));
  }
}
