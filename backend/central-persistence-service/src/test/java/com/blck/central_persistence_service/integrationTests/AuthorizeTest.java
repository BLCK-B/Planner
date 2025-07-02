package com.blck.central_persistence_service.integrationTests;

import com.blck.central_persistence_service.accounts.AccountRepository;
import com.blck.central_persistence_service.accounts.AccountService;
import com.blck.central_persistence_service.accounts.UserAccount;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.core.authority.AuthorityUtils.createAuthorityList;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.mockJwt;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
class AuthorizeTest {

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
	final UserAccount encodedAccount = new UserAccount(null, "username", bCryptPasswordEncoder.encode("password"), true, Set.of("ROLE_USER"));

	@Test
	void unauthenticatedUserIsUnauthorized() {
		webTestClient
				.mutateWith(csrf())
				.get()
				.uri("/users/loadItems")
				.exchange()
				.expectStatus().isUnauthorized();
	}

	@Test
	void authenticatedUserWithoutUserRoleIsForbidden() {
		webTestClient
				.mutateWith(csrf())
				.mutateWith(mockJwt()
						.jwt(jwt -> jwt.subject("username")))
				.get()
				.uri("/users/loadItems")
				.exchange()
				.expectStatus().isForbidden();
	}

	@Test
	void authenticatedUserCanAccessUserController() {
		webTestClient
				.mutateWith(csrf())
				.mutateWith(mockJwt()
						.jwt(jwt -> jwt.subject("username"))
						.authorities(createAuthorityList("ROLE_USER")))
				.get()
				.uri("/users/loadItems")
				.exchange()
				.expectStatus().isOk();
	}

	@Test
	void returnedJwtTokenContentsAreCorrect() throws JsonProcessingException {
		when(accountRepository.findByUsername(any())).thenReturn(Mono.just(encodedAccount));

		String jwtToken = webTestClient
			.mutateWith(csrf())
			.post()
			.uri("/auth/login")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(credentials)
			.exchange()
			.expectStatus().isOk()
			.expectBody(String.class)
			.returnResult()
			.getResponseBody();

		String[] parts = jwtToken.split("\\.");
		assertEquals(3, parts.length, "JWT token has 3 parts: header, payload, signature.");

		String decodedPayload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
		JsonNode payload = new ObjectMapper().readTree(decodedPayload);

		assertAll(
			() -> assertEquals("username", payload.get("sub").asText()),
			() -> assertTrue(payload.hasNonNull("iat")),
			() -> assertTrue(payload.hasNonNull("exp")),
			() -> {
				JsonNode rolesNode = payload.get("roles");
				List<String> roles = new ArrayList<>();
				rolesNode.forEach(node -> roles.add(node.asText()));
				assertTrue(roles.contains("ROLE_USER"));
			}
		);
	}

	@Test
	void securityContextRetentionWithJwt() {
		when(accountRepository.findByUsername(any())).thenReturn(Mono.just(encodedAccount));

		String jwtToken = webTestClient
			.mutateWith(csrf())
			.post()
			.uri("/auth/login")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(credentials)
			.exchange()
			.expectStatus().isOk()
			.expectBody(String.class)
			.returnResult()
			.getResponseBody();
		webTestClient
			.mutateWith(csrf())
			.get()
			.uri("/users/userAccountInfo")
			.header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
			.exchange()
			.expectStatus().isOk()
			.expectBody(String.class)
			.value(response -> assertEquals(encodedAccount.getUsername(), response));
	}


}
