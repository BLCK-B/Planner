package com.blck.planner.security;

import com.blck.planner.accounts.AccountService;
import com.blck.planner.accounts.Exceptions.AccountAlreadyExistsException;
import com.blck.planner.accounts.UserAccount;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private final AccountService accountService;

	private final ReactiveAuthenticationManager reactiveAuthenticationManager;

	@Autowired
	public AuthController(AccountService accountService, ReactiveAuthenticationManager reactiveAuthenticationManager) {
		this.accountService = accountService;
		this.reactiveAuthenticationManager = reactiveAuthenticationManager;
	}

	@PostMapping("/register")
	public Mono<ResponseEntity<UserAccount>> register(@RequestBody JsonNode credentials) {
		String username = credentials.get("username").asText();
		String password = credentials.get("password").asText();
		return accountService.registerUser(username, password)
				.map(ResponseEntity::ok)
				.onErrorResume(AccountAlreadyExistsException.class, ex ->
						Mono.just(ResponseEntity.status(HttpStatus.CONFLICT).body(null))
				)
				.defaultIfEmpty(ResponseEntity.badRequest().build());
	}

	@PostMapping(value = "/login")
	public Mono<ResponseEntity<String>> login(@RequestBody JsonNode credentials, ServerWebExchange exchange) {
		Authentication authRequest = new UsernamePasswordAuthenticationToken(
				credentials.get("username").asText(),
				credentials.get("password").asText()
		);

		return accountService.loginUser(exchange, authRequest, reactiveAuthenticationManager)
				.map(token -> ResponseEntity.ok("Authentication successful"))
				.onErrorResume(BadCredentialsException.class, e ->
						Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage()))
				)
				.onErrorResume(RuntimeException.class, e ->
						Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage()))
				);
	}

}
