package com.backend.todotask.service;

import com.backend.todotask.dto.TaskDTO;
import com.backend.todotask.model.TaskEntity;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface TaskService {
    TaskEntity createTodo(TaskDTO request);
    List<TaskEntity> getLatestTodos();
    TaskEntity markTodoDone(Long id);
}
