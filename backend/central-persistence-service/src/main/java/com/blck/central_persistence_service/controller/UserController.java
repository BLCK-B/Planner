package com.blck.central_persistence_service.controller;

import com.blck.central_persistence_service.model.User;
import com.blck.central_persistence_service.repository.UserRepository;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/users")
public class UserController {

	private final UserRepository userRepository;

	public UserController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	public Flux<User> getAllUsers() {
		return userRepository.findAll();
	}

	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public Mono<User> createUser(@RequestBody User user) {
		return userRepository.save(user);
	}

	@GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
	public Flux<User> findByName(@RequestParam String name) {
		return userRepository.findByNameContains(name);
	}
}
