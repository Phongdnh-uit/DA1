package com.phongdnh.se121.controllers.wish;

import com.phongdnh.se121.controllers.GenericController;
import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.wish.WishRequest;
import com.phongdnh.se121.dtos.wish.WishResponse;
import com.phongdnh.se121.entities.wish.Wish;
import com.phongdnh.se121.securities.SecurityUtil;
import com.phongdnh.se121.services.CrudService;
import io.github.perplexhub.rsql.RSQLJPASupport;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.jspecify.annotations.Nullable;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Wish")
@RequestMapping("/wishs")
@RestController
public class WishController extends GenericController<Wish, Long, WishRequest, WishResponse> {

  public WishController(CrudService<Wish, Long, WishRequest, WishResponse> service) {
    super(service);
  }

  @GetMapping("/all")
  @Override
  public ResponseEntity<ApiResponse<PageResponse<WishResponse>>> findAll(
      @ParameterObject Pageable pageable,
      @RequestParam(value = "filter", required = false) @Nullable String filter,
      @RequestParam(value = "all", defaultValue = "false") boolean all) {
    Specification<Wish> specification = RSQLJPASupport.toSpecification(filter);
    if (all) {
      pageable = Pageable.unpaged(pageable.getSort());
    }
    specification =
        specification.and(
            (root, _, builder) ->
                builder.equal(root.get("user").get("id"), SecurityUtil.getCurrentUserId()));
    return ResponseEntity.ok(ApiResponse.ok(service.findAll(pageable, specification)));
  }
}
