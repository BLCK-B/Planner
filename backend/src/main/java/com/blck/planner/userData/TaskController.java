package com.blck.planner.userData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@PreAuthorize("hasRole('ROLE_USER')")
public class TaskController {

    private final UserTaskRepository userTaskRepository;

    @Autowired
    public TaskController(UserTaskRepository userTaskRepository) {
        this.userTaskRepository = userTaskRepository;
    }

    @GetMapping(value = "/userAccountInfo")
    public Mono<String> getUserAccountInfo(@AuthenticationPrincipal Jwt jwt) {
        return Mono.just(jwt.getSubject());
    }

    // pagination in future
    @GetMapping(value = "/userTasks")
    public Flux<TaskDTO> getTasks(@AuthenticationPrincipal Jwt jwt) {
        return userTaskRepository.findByUserID(jwt.getSubject()).map(Task::toDTO);
    }

    @GetMapping(value = "/allUserTasks")
    public Flux<TaskDTO> getAllTasks(@AuthenticationPrincipal Jwt jwt) {
        return userTaskRepository.findByUserID(jwt.getSubject()).map(Task::toDTO);
    }

    @PutMapping(value = "/userTask")
    public Mono<TaskDTO> setTask(@AuthenticationPrincipal Jwt jwt, @RequestBody TaskDTO userItem) {
        TaskDTO dto = new TaskDTO(userItem.itemID(), userItem.data());
        return userTaskRepository.save(dto.toTask(jwt.getSubject()))
                .map(Task::toDTO);
    }

    @DeleteMapping(value = "/userTask/{taskID}")
    public Mono<String> deleteTask(@AuthenticationPrincipal Jwt jwt, @PathVariable String taskID) {
        return userTaskRepository.deleteByUserIDAndItemID(jwt.getSubject(), taskID)
                .thenReturn("User task removed successfully.");
    }

    @PutMapping(value = "/updateAllUserTasks")
    @Transactional
    public Mono<ResponseEntity<String>> setTasks(@AuthenticationPrincipal Jwt jwt, @RequestBody List<TaskDTO> userItems) {
        List<TaskDTO> dtos = userItems.stream()
                .map(userItem -> new TaskDTO(userItem.itemID(), userItem.data()))
                .toList();
        String userID = jwt.getSubject();
        return userTaskRepository.saveAll(dtos.stream().map(dto -> dto.toTask(userID)).collect(Collectors.toList()))
                .collectList()
                .map(savedTasks -> ResponseEntity.ok("Successfully updated " + savedTasks.size() + " tasks"))
                .defaultIfEmpty(ResponseEntity.status(500).body("Failed to update tasks"));
    }
}
