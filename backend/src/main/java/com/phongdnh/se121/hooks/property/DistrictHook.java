package com.phongdnh.se121.hooks.property;

import com.phongdnh.se121.dtos.property.DistrictRequest;
import com.phongdnh.se121.dtos.property.DistrictResponse;
import com.phongdnh.se121.entities.property.District;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.hooks.DefaultHook;
import com.phongdnh.se121.repositories.property.DistrictRepository;
import com.phongdnh.se121.repositories.property.ProvinceRepository;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class DistrictHook extends DefaultHook<District, Long, DistrictRequest, DistrictResponse> {
  private final ProvinceRepository provinceRepository;
  private final DistrictRepository districtRepository;

  @Override
  public void validateCreate(DistrictRequest input, Map<String, Object> context) {
    validate(input, null);
  }

  @Override
  public void validateUpdate(
      Long id, DistrictRequest input, District existingEntity, Map<String, Object> context) {
    validate(input, id);
  }

  private void validate(DistrictRequest input, Long id) {
    if (!provinceRepository.existsById(input.getProvinceId())) {
      throw new ApiException(ErrorCode.RESOURCE_NOT_FOUND);
    }
    Specification<District> codeSpec =
        (root, _, builder) -> builder.equal(root.get("code"), input.getCode());
    if (id != null) {
      codeSpec.and((root, _, builder) -> builder.notEqual(root.get("id"), id));
      if (districtRepository.exists(codeSpec)) {
        throw new ApiException(ErrorCode.RESOURCE_EXISTS, Map.of("code", "Code already exists"));
      }
    }
  }
}
