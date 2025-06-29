package com.blck.central_persistence_service.userData;

import com.blck.central_persistence_service.accounts.UserAccount;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.server.context.WebSessionServerSecurityContextRepository;
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
	private final WebSessionServerSecurityContextRepository securityContextRepository;

	@Autowired
	public UserController(UserItemRepository UserItemRepository, ReactiveMongoTemplate mongoTemplate, WebSessionServerSecurityContextRepository securityContextRepository) {
		this.UserItemRepository = UserItemRepository;
		this.mongoTemplate = mongoTemplate;
		this.securityContextRepository = securityContextRepository;
	}

	@GetMapping(value = "/userAccountInfo", produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<String> getUserAccountInfo(@AuthenticationPrincipal UserDetails userDetails) {
		return Mono.just(userDetails.getUsername());
//		return Mono.just(
//				new UserAccount(
//				null,
//				userDetails.getUsername(),
//				userDetails.getPassword(),
//		true,
//			Set.of(String.valueOf(Roles.USER)))
//		);
	}

	@GetMapping(value = "/loadItems", produces = MediaType.APPLICATION_JSON_VALUE)
	public Flux<UserItem> getAllUserItems(@AuthenticationPrincipal UserDetails userDetails) {
		return mongoTemplate.findAll(UserItem.class, userDetails.getUsername());
	}

	@PostMapping(value="/saveUserItem", consumes = MediaType.APPLICATION_JSON_VALUE)
	public Mono<String> saveUserItem(@AuthenticationPrincipal UserAccount user, @RequestBody JsonNode userItem) {
		String collectionName = user.getUsername();
		return mongoTemplate.save(userItem, collectionName)
				.thenReturn("User item saved successfully!");
	}
}
