package com.blck.central_persistence_service.controller;

import com.blck.central_persistence_service.model.UserItems;
import com.blck.central_persistence_service.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/users")
@PreAuthorize("hasRole('USER')")
public class UserController {

	private final UserRepository userRepository;

	public UserController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@GetMapping(value="/loadItems", produces = MediaType.APPLICATION_JSON_VALUE)
	public Flux<UserItems> getAllUsersData() {
		return userRepository.findAll();
	}

//	@DeleteMapping(value="/deleteItem", consumes = MediaType.APPLICATION_JSON_VALUE)
//	public Mono<ResponseEntity<UserItems>> deleteItem(@RequestBody JsonNode item) {
//		String userID = item.get("userID").asText();
//		String itemKey = item.get("item").get("key").toString();
//		return userRepository.findByUserID(userID)
//				.flatMap(existingUser ->
//						userRepository.save(existingUser).map(ResponseEntity::ok)
//				)
//				.switchIfEmpty(Mono.just(ResponseEntity.notFound().build()));
//	}

	@PostMapping(value="/saveUserItems", consumes = MediaType.APPLICATION_JSON_VALUE)
	public Mono<String> saveUserItems(@RequestBody JsonNode userItems) {
		System.out.println(userItems.toPrettyString());
		String userID = userItems.get("userID").asText();
		List<String> items = new ArrayList<>();
		userItems.get("items").forEach(item -> items.add(item.toString()));
		UserItems toSave = new UserItems(userID, items);
		return userRepository.save(toSave).map(String::valueOf);
	}

//	@GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
//	public Flux<User> findByName(@RequestParam String name) {
//		return userRepository.findByNameContains(name);
//	}
}
