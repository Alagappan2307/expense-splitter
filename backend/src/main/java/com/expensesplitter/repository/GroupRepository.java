package com.expensesplitter.repository;

import com.expensesplitter.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    Optional<Group> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}
