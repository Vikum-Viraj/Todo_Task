package com.backend.todotask.controller;

import com.backend.todotask.dto.TaskDTO;
import com.backend.todotask.model.TaskEntity;
import com.backend.todotask.service.TaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    // Test GET /api/todos
    @Test
    void shouldReturnListOfTodos() throws Exception {

        TaskEntity task1 = TaskEntity.builder()
                .id(1L)
                .title("Task 1")
                .description("Description 1")
                .completed(false)
                .createdAt(LocalDateTime.now())
                .build();

        TaskEntity task2 = TaskEntity.builder()
                .id(2L)
                .title("Task 2")
                .description("Description 2")
                .completed(true)
                .createdAt(LocalDateTime.now())
                .build();

        when(taskService.getLatestTodos()).thenReturn(List.of(task1, task2));

        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].title").value("Task 1"))
                .andExpect(jsonPath("$.data[1].completed").value(true));

        verify(taskService, times(1)).getLatestTodos();
    }

    // Test POST /api/todos
    @Test
    void shouldCreateTodo() throws Exception {
        TaskDTO dto = new TaskDTO();
        dto.setTitle("New Task");
        dto.setDescription("New Desc");

        TaskEntity savedTask = TaskEntity.builder()
                .id(1L)
                .title("New Task")
                .description("New Desc")
                .completed(false)
                .createdAt(LocalDateTime.now())
                .build();

        when(taskService.createTodo(any(TaskDTO.class))).thenReturn(savedTask);

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.title").value("New Task"));

        verify(taskService, times(1)).createTodo(any(TaskDTO.class));
    }

    // Test PUT /api/todos/{id}/done
    @Test
    void shouldMarkTodoDone() throws Exception {
        TaskEntity doneTask = TaskEntity.builder()
                .id(1L)
                .title("Task 1")
                .description("Desc")
                .completed(true)
                .createdAt(LocalDateTime.now())
                .build();

        when(taskService.markTodoDone(1L)).thenReturn(doneTask);

        mockMvc.perform(put("/api/todos/1/done"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.completed").value(true));

        verify(taskService, times(1)).markTodoDone(1L);
    }

    // Test PUT /api/todos/{id}
    @Test
    void shouldUpdateTodo() throws Exception {
        TaskDTO dto = new TaskDTO();
        dto.setTitle("Updated Task");
        dto.setDescription("Updated Desc");

        TaskEntity updatedTask = TaskEntity.builder()
                .id(1L)
                .title("Updated Task")
                .description("Updated Desc")
                .completed(false)
                .createdAt(LocalDateTime.now())
                .build();

        when(taskService.updateTodo(eq(1L), any(TaskDTO.class))).thenReturn(updatedTask);

        mockMvc.perform(put("/api/todos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Updated Task"));

        verify(taskService, times(1)).updateTodo(eq(1L), any(TaskDTO.class));
    }
}