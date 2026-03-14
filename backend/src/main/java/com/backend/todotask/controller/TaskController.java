package com.backend.todotask.controller;

import com.backend.todotask.dto.TaskDTO;
import com.backend.todotask.model.TaskEntity;
import com.backend.todotask.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TaskController {

    private final TaskService taskService; // ✅ interface, final

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<?> createTodo(@RequestBody TaskDTO request) {
        try {
            TaskEntity task = taskService.createTodo(request);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to create Todo: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getTodos() {
        try {
            List<TaskEntity> todos = taskService.getLatestTodos();
            return ResponseEntity.ok(todos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to fetch Todos: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/done")
    public ResponseEntity<?> markTodoDone(@PathVariable Long id) {
        try {
            TaskEntity updatedTask = taskService.markTodoDone(id);
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to mark Todo as done: " + e.getMessage());
        }
    }
}