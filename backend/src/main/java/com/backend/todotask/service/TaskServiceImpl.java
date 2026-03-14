package com.backend.todotask.service;

import com.backend.todotask.dto.TaskDTO;
import com.backend.todotask.model.TaskEntity;
import com.backend.todotask.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class TaskServiceImpl implements TaskService {
    private final TaskRepository todoRepository;

    public TaskServiceImpl(TaskRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Override
    public TaskEntity createTodo(TaskDTO request) {
        try {
            TaskEntity task = TaskEntity.builder()
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .completed(false)
                    .createdAt(LocalDateTime.now())
                    .build();
            return todoRepository.save(task);
        } catch (Exception e) {
            throw new RuntimeException("Error while creating Todo Task: " + e.getMessage());
        }
    }

    @Override
    public List<TaskEntity> getLatestTodos() {
        try {
            return todoRepository.findTop5ByCompletedFalseOrderByCreatedAtDesc();
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching Todos: " + e.getMessage());
        }

    }

    @Override
    public TaskEntity markTodoDone(Long id) {
        try {
            TaskEntity task = todoRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));
            task.setCompleted(true);
            return todoRepository.save(task);
        } catch (Exception e) {
            throw new RuntimeException("Error while updating Todo: " + e.getMessage());
        }
    }
}
