package com.blck.central_persistence_service.controller;

import com.blck.central_persistence_service.model.UserItems;
import com.blck.central_persistence_service.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

	private final UserRepository userRepository;

	public UserController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	public Flux<UserItems> getAllUsersData() {
		return userRepository.findAll();
	}

	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public Mono<String> saveUserItems(@RequestBody JsonNode usetItems) {
		System.out.println(usetItems.toPrettyString());
		String userID = usetItems.get("userID").asText();
		List<String> items = new ArrayList<>();
		usetItems.get("items").forEach(item -> items.add(item.toString()));
		UserItems userItems = new UserItems(userID, items);
		return userRepository.save(userItems).map(String::valueOf);
	}

//	@GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
//	public Flux<User> findByName(@RequestParam String name) {
//		return userRepository.findByNameContains(name);
//	}
}
