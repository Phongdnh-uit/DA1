package com.phongdnh.se121.controllers;

import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.services.CrudService;
import com.turkraft.springfilter.boot.Filter;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.groups.Default;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.context.annotation.Scope;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RequiredArgsConstructor
@Scope("prototype")
public abstract class GenericController<E, ID, I, O> {

  private final CrudService<E, ID, I, O> service;

  @GetMapping("/all")
  public PageResponse<O> findAll(
      @ParameterObject Pageable pageable,
      @Parameter(name = "filter", schema = @Schema(type = "string"), required = false) @Filter
          Specification<E> specification) {
    return service.findAll(pageable, specification);
  }

  @GetMapping("/{id}")
  public O findById(@PathVariable("id") ID id) {
    return service.findById(id);
  }

  @PostMapping()
  public O create(@Validated({Default.class}) @RequestBody I input) {
    return service.create(input);
  }

  @PutMapping("/{id}")
  public O update(@PathVariable("id") ID id, @Validated({Default.class}) @RequestBody I input) {
    return service.update(id, input);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable("id") ID id) {
    service.delete(id);
  }

  @DeleteMapping("/bulk")
  public void deleteAll(@RequestBody Iterable<ID> ids) {
    service.deleteAll(ids);
  }
}
