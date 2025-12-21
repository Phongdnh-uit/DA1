package com.phongdnh.se121.services;

import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.hooks.GenericHook;
import com.phongdnh.se121.mappers.GenericMapper;
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

  protected final SimpleRepository<E, ID> repository;
  protected final GenericMapper<E, I, O> mapper;
  protected final GenericHook<E, ID, I, O> hook;

  @Override
  public PageResponse<O> findAll(Pageable pageable, Specification<E> specification) {
    return defaultFindAll(pageable, specification, mapper, repository, hook);
  }

  @Override
  public O findById(ID id) {
    return defaultFindById(id, mapper, repository, hook);
  }

  @Override
  public O create(I input) {
    return defaultCreate(input, mapper, repository, hook);
  }

  @Override
  public O update(ID id, I input) {
    return defaultUpdate(id, input, mapper, repository, hook);
  }

  @Override
  public void delete(ID id) {
    defaultDelete(id, repository, hook);
  }

  @Override
  public void deleteAll(Iterable<ID> ids) {
    defaultDeleteAll(ids, repository, hook);
  }
}
