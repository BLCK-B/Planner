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
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.server.context.WebSessionServerSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private final ReactiveAuthenticationManager reactiveAuthenticationManager;
	private final WebSessionServerSecurityContextRepository securityContextRepository;
	private final AccountService accountService;

	@Autowired
	public AuthController(ReactiveAuthenticationManager reactiveAuthenticationManager,
						  WebSessionServerSecurityContextRepository securityContextRepository,
						  AccountService accountService) {
		this.reactiveAuthenticationManager = reactiveAuthenticationManager;
		this.securityContextRepository = securityContextRepository;
		this.accountService = accountService;
	}

	@PostMapping("/register")
	public Mono<ResponseEntity<UserAccount>> register(@RequestBody JsonNode credentials) {
		String username = credentials.get("username").asText();
		String password = credentials.get("password").asText();
		return accountService.registerUser(username, password)
				.map(ResponseEntity::ok)
				.defaultIfEmpty(ResponseEntity.badRequest().build());
	}

	@PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<ResponseEntity<String>> login(@RequestBody JsonNode credentials, ServerWebExchange exchange) {
		Authentication authRequest = new UsernamePasswordAuthenticationToken(
				credentials.get("username").asText(),
				credentials.get("password").asText()
		);

		return reactiveAuthenticationManager.authenticate(authRequest)
				.flatMap(authResponse -> {
					SecurityContext securityContext = new SecurityContextImpl(authResponse);
					return securityContextRepository.save(exchange, securityContext)
							.then(Mono.just(ResponseEntity.ok("Authentication Successful")));
				})
				.onErrorResume(e -> Mono.just(new ResponseEntity<>("Authentication failure", HttpStatus.UNAUTHORIZED)));
	}


}
