package com.phongdnh.se121.services;

import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.mappers.GenericMapper;
import com.phongdnh.se121.policies.GenericPolicy;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface CrudService<E, ID, I, O> {

  PageResponse<O> findAll(Pageable pageable, Specification<E> specification);

  O findById(ID id);

  O create(I input);

  O update(ID id, I input);

  void delete(ID id);

  void deleteAll(Iterable<ID> ids);

  default PageResponse<O> defaultFindAll(
      Pageable pageable,
      Specification<E> specification,
      GenericMapper<E, I, O> mapper,
      SimpleRepository<E, ID> repository) {
    return PageResponse.fromPage(
        repository.findAll(specification, pageable).map(mapper::entityToResponse));
  }

  default O defaultFindById(
      ID id, GenericMapper<E, I, O> mapper, SimpleRepository<E, ID> repository) {
    E entity =
        repository.findById(id).orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    return mapper.entityToResponse(entity);
  }

  default O defaultCreate(
      I input,
      GenericMapper<E, I, O> mapper,
      SimpleRepository<E, ID> repository,
      GenericPolicy<E, ID, I> policy) {
    policy.validateCreate(input);
    E entity = mapper.requestToEntity(input);
    policy.enrichCreate(input, entity);
    E savedEntity = repository.save(entity);
    policy.afterCreate(entity);
    return mapper.entityToResponse(savedEntity);
  }

  default O defaultUpdate(
      ID id,
      I input,
      GenericMapper<E, I, O> mapper,
      SimpleRepository<E, ID> repository,
      GenericPolicy<E, ID, I> policy) {
    E entity =
        repository.findById(id).orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    policy.validateUpdate(id, input, entity);
    mapper.partialUpdate(input, entity);
    policy.enrichUpdate(input, entity);
    entity = repository.save(entity);
    policy.afterUpdate(entity);
    return mapper.entityToResponse(entity);
  }

  default void defaultDelete(
      ID id, SimpleRepository<E, ID> repository, GenericPolicy<E, ID, I> policy) {
    policy.validateDelete(id);
    repository.deleteById(id);
    policy.afterDelete(id);
  }

  default void defaultDeleteAll(
      Iterable<ID> ids, SimpleRepository<E, ID> repository, GenericPolicy<E, ID, I> policy) {
    policy.validateBulkDelete(ids);
    repository.deleteAllByIdInBatch(ids);
    policy.afterBulkDelete(ids);
  }
}
