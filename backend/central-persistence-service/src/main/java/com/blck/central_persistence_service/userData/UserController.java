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
@PreAuthorize("hasRole('USER')")
public class UserController {

	// @AuthenticationPrincipal injects UserDetails to the method

	private final UserItemRepository UserItemRepository;

	private final ReactiveMongoTemplate mongoTemplate;


	@Autowired
	public UserController(UserItemRepository UserItemRepository, ReactiveMongoTemplate mongoTemplate) {
		this.UserItemRepository = UserItemRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@GetMapping(value = "/userAccountInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<String> getUserAccountInfo(@AuthenticationPrincipal Jwt jwt) {
		return Mono.just(jwt.getSubject());
	}

	@GetMapping(value = "/loadItems", produces = MediaType.APPLICATION_JSON_VALUE)
	public Flux<UserItem> getAllUserItems(@AuthenticationPrincipal Jwt jwt) {
		String username = jwt.getSubject();
		return mongoTemplate.findAll(UserItem.class, username);
	}

	@PostMapping(value = "/saveUserItem", consumes = MediaType.APPLICATION_JSON_VALUE)
	public Mono<String> saveUserItem(@AuthenticationPrincipal Jwt jwt, @RequestBody JsonNode userItem) {
		String collectionName = jwt.getSubject();
		return mongoTemplate.save(userItem, collectionName)
				.thenReturn("User item saved successfully!");
	}
}
