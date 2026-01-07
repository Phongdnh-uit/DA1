package com.phongdnh.se121.hooks.property;

import com.phongdnh.se121.constants.ErrorMessageConstants;
import com.phongdnh.se121.dtos.property.ProvinceRequest;
import com.phongdnh.se121.dtos.property.ProvinceResponse;
import com.phongdnh.se121.entities.property.Province;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.hooks.GenericHook;
import com.phongdnh.se121.repositories.property.ProvinceRepository;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class ProvinceHook
    implements GenericHook<Province, Long, ProvinceRequest, ProvinceResponse> {
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
        (root, _, criteriaBuilder) -> criteriaBuilder.equal(root.get("code"), request.getCode());
    if (id != null) {
      codeSpec =
          codeSpec.and((root, _, criteriaBuilder) -> criteriaBuilder.notEqual(root.get("id"), id));
    }
    if (provinceRepository.exists(codeSpec)) {
      errors.put("code", ErrorMessageConstants.PROVINCE_CODE_EXISTS);
    }

    if (!errors.isEmpty()) {
      throw new ApiException(ErrorCode.RESOURCE_EXISTS, errors);
    }
  }
}
