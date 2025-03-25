package com.blck.central_persistence_service.integrationTests;

import com.blck.central_persistence_service.accounts.AccountRepository;
import com.blck.central_persistence_service.accounts.AccountService;
import com.blck.central_persistence_service.accounts.UserAccount;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;
import java.util.Set;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
class AuthentizeTest {
	@Autowired
	private WebTestClient webTestClient;

	@MockitoBean
	AccountRepository accountRepository;

	@MockitoBean
	UserDetailsService userDetailsService;

	@Autowired
	private AccountService accountService;

	final ObjectMapper objectMapper = new ObjectMapper();
	JsonNode credentials = objectMapper.createObjectNode()
			.put("username", "username")
			.put("password", "password");

	final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
	final UserAccount existingUserAccount = new UserAccount(null, "username", "password", true, Set.of("USER"));
	final UserAccount encodedAccount = new UserAccount(null, "username", bCryptPasswordEncoder.encode("password"), true, Set.of("USER"));

	@Test
	void registerUserSuccess() {
		when(accountRepository.findByUsername(any())).thenReturn(Mono.empty());
		when(accountRepository.save(any(UserAccount.class))).thenReturn(Mono.just(existingUserAccount));

		webTestClient
				.mutateWith(csrf())
				.post()
				.uri("/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.bodyValue(credentials)
				.exchange()
				.expectStatus().isEqualTo(200)
				.expectBody()
				.jsonPath("$.username").isEqualTo("username")
				.jsonPath("$.password").isEqualTo("password")
				.jsonPath("$.roles[0]").isEqualTo("USER");
	}

	@Test
	void registerExistingUser() {
		when(accountRepository.findByUsername(any())).thenReturn(Mono.just(existingUserAccount));
		when(accountRepository.save(any(UserAccount.class))).thenReturn(Mono.just(existingUserAccount));

		webTestClient
				.mutateWith(csrf())
				.post()
				.uri("/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.bodyValue(credentials)
				.exchange()
				.expectStatus().isEqualTo(409)
				.expectBody().isEmpty();
	}

	@Test
	void loginUserSuccess() {
		when(accountRepository.findByUsername(any())).thenReturn(Mono.just(encodedAccount));

		webTestClient
				.mutateWith(csrf())
				.post()
				.uri("/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.bodyValue(credentials)
				.exchange()
				.expectStatus().isOk();
	}

	@Test
	void loginUserWrongCredentials() {
		when(accountRepository.findByUsername(any())).thenReturn(Mono.just(encodedAccount));
		credentials = objectMapper.createObjectNode()
				.put("username", "username")
				.put("password", "wrongPassword");

		webTestClient
				.mutateWith(csrf())
				.post()
				.uri("/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.bodyValue(credentials)
				.exchange()
				.expectStatus().isUnauthorized();
	}


}

