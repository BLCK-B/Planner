package com.blck.planner.userData;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

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

    @GetMapping(value = "/userAccountInfo", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> getUserAccountInfo(@AuthenticationPrincipal Jwt jwt) {
        return Mono.just(jwt.getSubject());
    }

    @GetMapping(value = "/userTasks", produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<Task> getTasks(@AuthenticationPrincipal Jwt jwt) {
        return userTaskRepository.findByUserID(jwt.getSubject());
    }

    @PutMapping(value = "/userTask", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Task> setTask(@AuthenticationPrincipal Jwt jwt, @RequestBody JsonNode userItem) {
        String itemID = userItem.get("itemID").asText();
        if (itemID == null || itemID.isBlank()) {
            itemID = null;
        }
        Task.Data data = objectMapper.convertValue(userItem.get("data"), Task.Data.class);
        Task task = new Task(itemID, jwt.getSubject(), data);
        return userTaskRepository.save(task);
    }

    @DeleteMapping(value = "/userTask/{taskID}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> deleteTask(@AuthenticationPrincipal Jwt jwt, @PathVariable String taskID) {
        return userTaskRepository.deleteByUserIDAndItemID(jwt.getSubject(), taskID)
                .thenReturn("User task removed successfully.");
    }
}
