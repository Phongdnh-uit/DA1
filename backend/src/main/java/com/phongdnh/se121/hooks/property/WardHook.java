package com.phongdnh.se121.hooks.property;

import com.phongdnh.se121.dtos.property.WardRequest;
import com.phongdnh.se121.dtos.property.WardResponse;
import com.phongdnh.se121.entities.property.Ward;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.hooks.GenericHook;
import com.phongdnh.se121.repositories.property.ProvinceRepository;
import com.phongdnh.se121.repositories.property.WardRepository;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class WardHook implements GenericHook<Ward, Long, WardRequest, WardResponse> {
  private final ProvinceRepository provinceRepository;
  private final WardRepository wardRepository;

  @Override
  public void validateCreate(WardRequest input, Map<String, Object> context) {
    validate(input, null);
  }

  @Override
  public void validateUpdate(
      Long id, WardRequest input, Ward existingEntity, Map<String, Object> context) {
    validate(input, id);
  }

  @Override
  public void enrichCreate(WardRequest input, Ward entity, Map<String, Object> context) {
    enrich(input, entity);
  }

  @Override
  public void enrichUpdate(WardRequest input, Ward entity, Map<String, Object> context) {
    enrich(input, entity);
  }

  private void validate(WardRequest input, Long id) {
    Map<String, String> errors = new HashMap<>();
    if (!provinceRepository.existsById(input.getProvinceId())) {
      errors.put("provinceId", "Province does not exist");
    }
    Specification<Ward> codeNameSpec =
        (root, _, builder) -> builder.equal(root.get("code"), input.getCode());
    if (id != null) {
      codeNameSpec = codeNameSpec.and((root, _, builder) -> builder.notEqual(root.get("id"), id));
    }
    if (wardRepository.exists(codeNameSpec)) {
      errors.put("code", "Ward code already exists");
    }
    if (!errors.isEmpty()) {
      throw new ApiException(ErrorCode.VALIDATION_ERROR, errors);
    }
  }

  private void enrich(WardRequest input, Ward entity) {
    entity.setProvince(provinceRepository.getReferenceById(input.getProvinceId()));
  }
}
