package com.phongdnh.se121.policies;

/**
 * GenericPolicy
 *
 * @param <E> Entity type
 * @param <ID> Identifier type
 * @param <I> Input type
 */
public interface GenericPolicy<E, ID, I> {
  // ============================ CREATE ============================
  void validateCreate(I input);

  void enrichCreate(I input, E entity);

  void afterCreate(E entity);

  // ============================ UPDATE ============================

  void validateUpdate(ID id, I input, E existingEntity);

  void enrichUpdate(I input, E entity);

  void afterUpdate(E entity);

  // ============================ DELETE ============================
  void validateDelete(ID id);

  void afterDelete(ID id);

  void validateBulkDelete(Iterable<ID> ids);

  void afterBulkDelete(Iterable<ID> ids);
}
