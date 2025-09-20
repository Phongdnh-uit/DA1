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
  default void validateCreate(I input) {}

  default void enrichCreate(I input, E entity) {}

  default void afterCreate(E entity) {}

  // ============================ UPDATE ============================

  default void validateUpdate(ID id, I input, E existingEntity) {}

  default void enrichUpdate(I input, E entity) {}

  default void afterUpdate(E entity) {}

  // ============================ DELETE ============================
  default void validateDelete(ID id) {}

  default void afterDelete(ID id) {}

  default void validateBulkDelete(Iterable<ID> ids) {}

  default void afterBulkDelete(Iterable<ID> ids) {}
}
