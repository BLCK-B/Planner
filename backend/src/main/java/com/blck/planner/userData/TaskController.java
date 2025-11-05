package com.blck.planner.userData;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@PreAuthorize("hasRole('ROLE_USER')")
public class TaskController {

    private final UserTaskRepository userTaskRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public TaskController(UserTaskRepository userTaskRepository) {
        this.userTaskRepository = userTaskRepository;
    }

    @GetMapping(value = "/userAccountInfo")
    public Mono<String> getUserAccountInfo(@AuthenticationPrincipal Jwt jwt) {
        return Mono.just(jwt.getSubject());
    }

    @GetMapping(value = "/userTasks")
    public Flux<TaskDTO> getTasks(@AuthenticationPrincipal Jwt jwt) {
        return userTaskRepository.findByUserID(jwt.getSubject()).map(Task::toDTO);
    }

    @PutMapping(value = "/userTask")
    public Mono<TaskDTO> setTask(@AuthenticationPrincipal Jwt jwt, @RequestBody JsonNode userItem) {
        String itemIdString = userItem.get("itemID").asText(null);
        UUID itemID = null;
        if (itemIdString != null && !itemIdString.isBlank()) {
            itemID = UUID.fromString(itemIdString);
        }
        TaskDTO.Data data = objectMapper.convertValue(userItem.get("data"), TaskDTO.Data.class);
        TaskDTO dto = new TaskDTO(itemID, jwt.getSubject(), data);
        return userTaskRepository.save(dto.toTask()).map(Task::toDTO);
    }

    @DeleteMapping(value = "/userTask/{taskID}")
    public Mono<String> deleteTask(@AuthenticationPrincipal Jwt jwt, @PathVariable String taskID) {
        return userTaskRepository.deleteByUserIDAndItemID(jwt.getSubject(), taskID)
                .thenReturn("User task removed successfully.");
    }
}
