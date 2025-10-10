package com.phongdnh.se121.hooks.property;

import com.phongdnh.se121.dtos.property.ProvinceRequest;
import com.phongdnh.se121.dtos.property.ProvinceResponse;
import com.phongdnh.se121.entities.property.Province;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.hooks.DefaultHook;
import com.phongdnh.se121.repositories.property.ProvinceRepository;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class ProvinceHook extends DefaultHook<Province, Long, ProvinceRequest, ProvinceResponse> {
  private final ProvinceRepository provinceRepository;

  @Override
  public void validateCreate(ProvinceRequest input, Map<String, Object> context) {
    validate(input, null);
  }

  @Override
  public void validateUpdate(
      Long id, ProvinceRequest input, Province existingEntity, Map<String, Object> context) {
    validate(input, id);
  }

  private void validate(ProvinceRequest request, Long id) {
    Map<String, String> errors = new HashMap<>();
    Specification<Province> codeSpec =
        (root, _, criteriaBuilder) ->
            criteriaBuilder.equal(root.get("phoneCode"), request.getPhoneCode());
    if (id != null) {
      codeSpec =
          codeSpec.and((root, _, criteriaBuilder) -> criteriaBuilder.notEqual(root.get("id"), id));
    }
    if (provinceRepository.exists(codeSpec)) {
      errors.put("phoneCode", "Phone code already exists");
    }

    Specification<Province> codeNameSpec =
        (root, _, criteriaBuilder) ->
            criteriaBuilder.equal(root.get("codeName"), request.getCodeName());
    if (id != null) {
      codeNameSpec =
          codeNameSpec.and(
              (root, _, criteriaBuilder) -> criteriaBuilder.notEqual(root.get("id"), id));
    }
    if (provinceRepository.exists(codeNameSpec)) {
      errors.put("codeName", "Code name already exists");
    }
    if (!errors.isEmpty()) {
      throw new ApiException(ErrorCode.RESOURCE_EXISTS, errors);
    }
  }
}
