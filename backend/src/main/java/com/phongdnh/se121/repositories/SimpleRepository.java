package com.phongdnh.se121.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * @param E Entity type
 * @param ID ID type of the entity
 */
@NoRepositoryBean
public interface SimpleRepository<E, ID>
    extends JpaRepository<E, ID>, JpaSpecificationExecutor<E> {}
