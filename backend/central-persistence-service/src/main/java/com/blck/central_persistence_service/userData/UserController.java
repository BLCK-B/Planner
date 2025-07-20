package com.blck.central_persistence_service.userData;

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
public class UserController {

	private final UserItemRepository userItemRepository;

	private final ReactiveMongoTemplate mongoTemplate;


	@Autowired
	public UserController(UserItemRepository userItemRepository, ReactiveMongoTemplate mongoTemplate) {
		this.userItemRepository = userItemRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@GetMapping(value = "/userAccountInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<String> getUserAccountInfo(@AuthenticationPrincipal Jwt jwt) {
		return Mono.just(jwt.getSubject());
	}

	@GetMapping(value = "/userTasks", produces = MediaType.APPLICATION_JSON_VALUE)
	public Flux<Task> userTasks(@AuthenticationPrincipal Jwt jwt) {
		return userItemRepository.findByUserID(jwt.getSubject());
	}

	@PutMapping(value = "/userTask", consumes = MediaType.APPLICATION_JSON_VALUE)
	public Mono<String> setUserTask(@AuthenticationPrincipal Jwt jwt, @RequestBody JsonNode userItem) {
		Task task = new Task(null, jwt.getSubject(), userItem.get("data").toString());
		return mongoTemplate.save(task)
				.thenReturn("User task saved successfully.");
	}

	@DeleteMapping(value = "/userTask/{taskID}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public Mono<String> deleteUserTask(@AuthenticationPrincipal Jwt jwt, @PathVariable String taskID) {
		return userItemRepository.deleteByUserIDAndItemID(jwt.getSubject(), taskID)
				.thenReturn("User task removed successfully.");
	}
}
