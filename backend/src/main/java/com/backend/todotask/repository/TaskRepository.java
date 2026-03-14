package com.backend.todotask.repository;

import com.backend.todotask.model.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity,Long> {
    List<TaskEntity> findTop5ByCompletedFalseOrderByCreatedAtDesc();
}
