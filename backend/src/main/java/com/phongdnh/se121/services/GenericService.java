package com.phongdnh.se121.services;

import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.mappers.GenericMapper;
import com.phongdnh.se121.policies.GenericPolicy;
import com.phongdnh.se121.repositories.SimpleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Scope;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

/**
 * @param E entity type
 * @param ID entity id type
 * @param I input dto type
 * @param O output dto type
 */
@RequiredArgsConstructor
@Scope("prototype")
public class GenericService<E, ID, I, O> implements CrudService<E, ID, I, O> {

  private final SimpleRepository<E, ID> repository;
  private final GenericMapper<E, I, O> mapper;
  private final GenericPolicy<E, ID, I> policy;

  @Override
  public PageResponse<O> findAll(Pageable pageable, Specification<E> specification) {
    return defaultFindAll(pageable, specification, mapper, repository);
  }

  @Override
  public O findById(ID id) {
    return defaultFindById(id, mapper, repository);
  }

  @Override
  public O create(I input) {
    return defaultCreate(input, mapper, repository, policy);
  }

  @Override
  public O update(ID id, I input) {
    return defaultUpdate(id, input, mapper, repository, policy);
  }

  @Override
  public void delete(ID id) {
    defaultDelete(id, repository, policy);
  }

  @Override
  public void deleteAll(Iterable<ID> ids) {
    defaultDeleteAll(ids, repository, policy);
  }
}
