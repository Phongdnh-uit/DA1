package com.phongdnh.se121.hooks;

import java.util.Map;

public class DefaultHook<E, ID, I, O> implements GenericHook<E, ID, I, O> {

  @Override
  public void validateCreate(I input, Map<String, Object> context) {}

  @Override
  public void enrichCreate(I input, E entity, Map<String, Object> context) {}

  @Override
  public void afterCreate(E entity, O response, Map<String, Object> context) {}

  @Override
  public void validateUpdate(ID id, I input, E existingEntity, Map<String, Object> context) {}

  @Override
  public void enrichUpdate(I input, E entity, Map<String, Object> context) {}

  @Override
  public void afterUpdate(E entity, O response, Map<String, Object> context) {}

  @Override
  public void validateDelete(ID id) {}

  @Override
  public void afterDelete(ID id) {}

  @Override
  public void validateBulkDelete(Iterable<ID> ids) {}

  @Override
  public void afterBulkDelete(Iterable<ID> ids) {}
}
