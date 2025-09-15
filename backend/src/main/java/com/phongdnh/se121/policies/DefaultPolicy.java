package com.phongdnh.se121.policies;

import org.springframework.stereotype.Component;

@Component
public class DefaultPolicy<E, ID, I> implements GenericPolicy<E, ID, I> {

  @Override
  public void validateCreate(I input) {}

  @Override
  public void enrichCreate(I input, E entity) {}

  @Override
  public void afterCreate(E entity) {}

  @Override
  public void validateUpdate(ID id, I input, E existingEntity) {}

  @Override
  public void enrichUpdate(I input, E entity) {}

  @Override
  public void afterUpdate(E entity) {}

  @Override
  public void validateDelete(ID id) {}

  @Override
  public void afterDelete(ID id) {}

  @Override
  public void validateBulkDelete(Iterable<ID> ids) {}

  @Override
  public void afterBulkDelete(Iterable<ID> ids) {}
}
