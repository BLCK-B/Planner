package com.blck.planner.userData;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
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

    private final UserItemRepository userItemRepository;

    private final ReactiveMongoTemplate mongoTemplate;

    @Autowired
    public TaskController(UserItemRepository userItemRepository, ReactiveMongoTemplate mongoTemplate) {
        this.userItemRepository = userItemRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping(value = "/userAccountInfo", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> getUserAccountInfo(@AuthenticationPrincipal Jwt jwt) {
        return Mono.just(jwt.getSubject());
    }

    @GetMapping(value = "/userTasks", produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<Task> getTasks(@AuthenticationPrincipal Jwt jwt) {
        return userItemRepository.findByUserID(jwt.getSubject());
    }

    @PutMapping(value = "/userTask", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Task> setTask(@AuthenticationPrincipal Jwt jwt, @RequestBody JsonNode userItem) {
        String itemID = userItem.get("itemID").asText();
        if (itemID == null || itemID.isBlank()) {
            itemID = null;
        }
        Task task = new Task(itemID, jwt.getSubject(), userItem.get("data").toString());
        return mongoTemplate.save(task);
    }

    @DeleteMapping(value = "/userTask/{taskID}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> deleteTask(@AuthenticationPrincipal Jwt jwt, @PathVariable String taskID) {
        return userItemRepository.deleteByUserIDAndItemID(jwt.getSubject(), taskID)
                .thenReturn("User task removed successfully.");
    }
}
