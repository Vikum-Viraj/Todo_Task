package com.backend.todotask.controller;

import com.backend.todotask.dto.response.ApiResponse;
import com.backend.todotask.dto.TaskDTO;
import com.backend.todotask.model.TaskEntity;
import com.backend.todotask.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskEntity>> createTodo(@RequestBody TaskDTO request) {
        try {
            TaskEntity task = taskService.createTodo(request);
            return ResponseEntity.ok(ApiResponse.<TaskEntity>builder()
                    .success(true)
                    .data(task)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.<TaskEntity>builder()
                            .success(false)
                            .message("Failed to create Todo: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskEntity>>> getTodos() {
        try {
            List<TaskEntity> todos = taskService.getLatestTodos();
            return ResponseEntity.ok(ApiResponse.<List<TaskEntity>>builder()
                    .success(true)
                    .data(todos)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.<List<TaskEntity>>builder()
                            .success(false)
                            .message("Failed to fetch Todos: " + e.getMessage())
                            .build());
        }
    }

    @PutMapping("/{id}/done")
    public ResponseEntity<ApiResponse<TaskEntity>> markTodoDone(@PathVariable Long id) {
        try {
            TaskEntity updatedTask = taskService.markTodoDone(id);
            return ResponseEntity.ok(ApiResponse.<TaskEntity>builder()
                    .success(true)
                    .data(updatedTask)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.<TaskEntity>builder()
                            .success(false)
                            .message("Failed to mark Todo as done: " + e.getMessage())
                            .build());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskEntity>> updateTodo(
            @PathVariable Long id,
            @RequestBody TaskDTO request) {
        try {
            TaskEntity updatedTask = taskService.updateTodo(id, request);
            return ResponseEntity.ok(ApiResponse.<TaskEntity>builder()
                    .success(true)
                    .data(updatedTask)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.<TaskEntity>builder()
                            .success(false)
                            .message("Failed to update Todo: " + e.getMessage())
                            .build());
        }
    }
}