package com.backend.todotask.service;

import com.backend.todotask.dto.TaskDTO;
import com.backend.todotask.model.TaskEntity;
import com.backend.todotask.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    @Test
    void createTodo_shouldSaveTask() {

        TaskDTO dto = new TaskDTO();
        dto.setTitle("Test Task");
        dto.setDescription("Testing");

        TaskEntity savedTask = TaskEntity.builder()
                .id(1L)
                .title("Test Task")
                .description("Testing")
                .completed(false)
                .build();

        when(taskRepository.save(any(TaskEntity.class))).thenReturn(savedTask);

        TaskEntity result = taskService.createTodo(dto);

        assertNotNull(result);
        assertEquals("Test Task", result.getTitle());

        verify(taskRepository, times(1)).save(any(TaskEntity.class));
    }


    @Test
    void getLatestTodos_shouldReturnList() {

        TaskEntity t1 = TaskEntity.builder().id(1L).title("Task1").build();
        TaskEntity t2 = TaskEntity.builder().id(2L).title("Task2").build();

        when(taskRepository.findTop5ByCompletedFalseOrderByCreatedAtDesc())
                .thenReturn(List.of(t1, t2));

        List<TaskEntity> result = taskService.getLatestTodos();

        assertEquals(2, result.size());
        verify(taskRepository).findTop5ByCompletedFalseOrderByCreatedAtDesc();
    }

    @Test
    void markTodoDone_shouldUpdateCompletedStatus() {

        TaskEntity task = TaskEntity.builder()
                .id(1L)
                .title("Test")
                .completed(false)
                .build();

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(TaskEntity.class))).thenReturn(task);

        TaskEntity result = taskService.markTodoDone(1L);

        assertTrue(result.isCompleted());

        verify(taskRepository).save(task);
    }


    @Test
    void updateTodo_shouldUpdateTaskDetails() {

        TaskDTO dto = new TaskDTO();
        dto.setTitle("Updated Title");
        dto.setDescription("Updated Description");

        TaskEntity task = TaskEntity.builder()
                .id(1L)
                .title("Old")
                .description("Old Desc")
                .build();

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(TaskEntity.class))).thenReturn(task);

        TaskEntity result = taskService.updateTodo(1L, dto);

        assertEquals("Updated Title", result.getTitle());
        assertEquals("Updated Description", result.getDescription());

        verify(taskRepository).save(task);
    }
}