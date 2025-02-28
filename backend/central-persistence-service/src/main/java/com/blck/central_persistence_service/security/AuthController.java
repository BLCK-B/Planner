package com.blck.central_persistence_service.security;

import com.blck.central_persistence_service.accounts.AccountService;
import com.blck.central_persistence_service.accounts.UserAccount;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private final ReactiveAuthenticationManager reactiveAuthenticationManager;
	private final HttpSessionSecurityContextRepository securityContextRepository;
	private final AccountService accountService;

	@Autowired
	public AuthController(ReactiveAuthenticationManager reactiveAuthenticationManager,
						  HttpSessionSecurityContextRepository securityContextRepository,
						  AccountService accountService) {
		this.reactiveAuthenticationManager = reactiveAuthenticationManager;
		this.securityContextRepository = securityContextRepository;
		this.accountService = accountService;
	}

	@PostMapping("/register")
	public Mono<ResponseEntity<UserAccount>> register(@RequestBody JsonNode credentials, HttpServletRequest request, HttpServletResponse response) {
		String username = credentials.get("username").asText();
		String password = credentials.get("password").asText();
		return accountService.registerUser(username, password)
				.map(ResponseEntity::ok)
				.defaultIfEmpty(ResponseEntity.badRequest().build());
	}

	@PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<ResponseEntity<String>> login(@RequestBody JsonNode credentials, HttpServletRequest request, HttpServletResponse response) {
		Authentication authRequest = new UsernamePasswordAuthenticationToken(
				credentials.get("username").asText(),
				credentials.get("password").asText()
		);
		return reactiveAuthenticationManager.authenticate(authRequest)
				.doOnNext(authResponse -> {
					SecurityContext securityContext = SecurityContextHolder.getContext();
					securityContext.setAuthentication(authResponse);
					securityContextRepository.saveContext(securityContext, request, response);
				})
				.map(authResponse -> ResponseEntity.ok("Authentication Successful"))
				.onErrorResume(e -> Mono.just(new ResponseEntity<>("Authentication failure", HttpStatus.UNAUTHORIZED)));
	}


//	@GetMapping("/{username}")
//	public Mono<ResponseEntity<UserAccount>> getUser(@PathVariable String username) {
//		return accountService.findByUsername(username)
//				.map(ResponseEntity::ok)
//				.defaultIfEmpty(ResponseEntity.notFound().build());
//	}

}
