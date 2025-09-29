package com.phongdnh.se121.hooks;

import java.util.Map;

/**
 * GenericPolicy
 *
 * @param <E> Entity type
 * @param <ID> Identifier type
 * @param <I> Input type
 */
public interface GenericHook<E, ID, I, O> {
  // ============================ CREATE ============================
  void validateCreate(I input, Map<String, Object> context);

  void enrichCreate(I input, E entity, Map<String, Object> context);

  void afterCreate(E entity, O response, Map<String, Object> context);

  // ============================ UPDATE ============================

  void validateUpdate(ID id, I input, E existingEntity, Map<String, Object> context);

  void enrichUpdate(I input, E entity, Map<String, Object> context);

  void afterUpdate(E entity, O response, Map<String, Object> context);

  // ============================ DELETE ============================
  void validateDelete(ID id);

  void afterDelete(ID id);

  void validateBulkDelete(Iterable<ID> ids);

  void afterBulkDelete(Iterable<ID> ids);
}
