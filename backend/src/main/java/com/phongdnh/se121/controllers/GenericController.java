package com.phongdnh.se121.controllers;

import com.phongdnh.se121.dtos.Action.Create;
import com.phongdnh.se121.dtos.Action.Update;
import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.services.CrudService;
import io.github.perplexhub.rsql.RSQLJPASupport;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.groups.Default;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RequiredArgsConstructor
public abstract class GenericController<E, ID, I, O> {

  private final CrudService<E, ID, I, O> service;

  @Operation(operationId = "findAll{Resource}")
  @GetMapping("/all")
  public PageResponse<O> findAll(
      @ParameterObject Pageable pageable,
      @RequestParam(value = "filter", required = false) @Nullable String filter) {
    Specification<E> specification = RSQLJPASupport.toSpecification(filter);
    return service.findAll(pageable, specification);
  }

  @Operation(operationId = "find{Resource}ById")
  @GetMapping("/{id}")
  public O findById(@PathVariable("id") ID id) {
    return service.findById(id);
  }

  @Operation(operationId = "create{Resource}")
  @PostMapping()
  public O create(@Validated({Default.class, Create.class}) @RequestBody I input) {
    return service.create(input);
  }

  @Operation(operationId = "update{Resource}")
  @PutMapping("/{id}")
  public O update(
      @PathVariable("id") ID id, @Validated({Default.class, Update.class}) @RequestBody I input) {
    return service.update(id, input);
  }

  @Operation(operationId = "delete{Resource}ById")
  @DeleteMapping("/{id}")
  public void delete(@PathVariable("id") ID id) {
    service.delete(id);
  }

  @Operation(operationId = "deleteBulk{Resource}")
  @DeleteMapping("/bulk")
  public void deleteAll(@RequestParam("ids") List<ID> ids) {
    service.deleteAll(ids);
  }
}
