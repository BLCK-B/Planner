package com.blck.central_persistence_service.controller;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collection;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private final AuthenticationManager authenticationManager;
	private final HttpSessionSecurityContextRepository securityContextRepository;

	@Autowired
	public AuthController(AuthenticationManager authenticationManager, HttpSessionSecurityContextRepository securityContextRepository) {
		this.authenticationManager = authenticationManager;
		this.securityContextRepository = securityContextRepository;
	}

	@PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> login(@RequestBody JsonNode credentials, HttpServletRequest request, HttpServletResponse response) {
		Authentication authRequest = UsernamePasswordAuthenticationToken.unauthenticated(
				credentials.get("username").asText(),
				credentials.get("password").asText()
		);
		try {
			Authentication authResponse = authenticationManager.authenticate(authRequest);

			SecurityContext securityContext = SecurityContextHolder.getContext();
			securityContext.setAuthentication(authResponse);

			securityContextRepository.saveContext(securityContext, request, response);

			return ResponseEntity.ok("Authentication Successful");
		} catch (Exception e) {
			return new ResponseEntity<>("Authentication failure", HttpStatus.UNAUTHORIZED);
		}
	}

}
