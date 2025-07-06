package com.blck.central_persistence_service.integrationTests;

import com.blck.central_persistence_service.accounts.AccountRepository;
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
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.*;

import static com.blck.central_persistence_service.security.SecurityNames.JWT_COOKIE_NAME;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.core.authority.AuthorityUtils.createAuthorityList;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.mockJwt;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
class AuthControllerTests {

	@Autowired
	private WebTestClient webTestClient;

	@MockitoBean
	AccountRepository accountRepository;

	final ObjectMapper objectMapper = new ObjectMapper();
	JsonNode credentials = objectMapper.createObjectNode()
			.put("username", "username")
			.put("password", "password");

	final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
	final UserAccount existingUserAccount = new UserAccount(null, "username", "password", true, Set.of("USER"));
	final UserAccount encodedAccount = new UserAccount(null, "username", bCryptPasswordEncoder.encode("password"), true, Set.of("ROLE_USER"));
	final UserAccount encodedAccountDiffPswd = new UserAccount(null, "username", bCryptPasswordEncoder.encode("different"), true, Set.of("ROLE_USER"));


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
			.expectStatus().isOk()
			.expectBody()
			.jsonPath("$.username").isEqualTo("username")
			.jsonPath("$.password").isEqualTo("password")
			.jsonPath("$.roles[0]").isEqualTo("USER");
	}

	@Test
	void registerExistingUserReturnsConlict() {
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
	void registerExistingUserReturnsConlictDiffPasswordCheck() {
		when(accountRepository.findByUsername(any())).thenReturn(Mono.just(existingUserAccount));
		when(accountRepository.save(any(UserAccount.class))).thenReturn(Mono.just(encodedAccountDiffPswd));

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
	void registerUserFromLoggedInUser() {
		when(accountRepository.findByUsername(any())).thenReturn(Mono.empty());
		when(accountRepository.save(any(UserAccount.class))).thenReturn(Mono.just(existingUserAccount));

		webTestClient
			.mutateWith(csrf())
			.mutateWith(mockJwt()
					.jwt(jwt -> jwt.subject("username"))
					.authorities(createAuthorityList("ROLE_USER")))
			.post()
			.uri("/auth/register")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(credentials)
			.exchange()
			.expectStatus().isOk()
			.expectBody()
			.jsonPath("$.username").isEqualTo("username")
			.jsonPath("$.password").isEqualTo("password")
			.jsonPath("$.roles[0]").isEqualTo("USER");
	}

	@Test
	void registerUserNullCredentialsIsBadRequest() {
		webTestClient
			.mutateWith(csrf())
			.post()
			.uri("/auth/register")
			.contentType(MediaType.APPLICATION_JSON)
			.exchange()
			.expectStatus().isBadRequest();
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
	void loginUserWrongCredentialsReturnsUnauthorized() {
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

	@Test
	void jwtIsNotEmbeddedInResponseBodyOrHeader() {
		when(accountRepository.findByUsername(any())).thenReturn(Mono.just(encodedAccount));

		webTestClient
			.mutateWith(csrf())
			.post()
			.uri("/auth/login")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(credentials)
			.exchange()
			.expectStatus().isOk()
			.expectBody()
			.consumeWith(response -> {
				assertAll(
						() -> assertEquals("Authentication successful", new String(Objects.requireNonNull(response.getResponseBody()), StandardCharsets.UTF_8)),
						() -> assertNull(response.getResponseHeaders().getFirst(HttpHeaders.AUTHORIZATION))
				);
			});
	}

	@Test
	void jwtIsInSecureCookie() {
		when(accountRepository.findByUsername(any())).thenReturn(Mono.just(encodedAccount));

		webTestClient
			.mutateWith(csrf())
			.post()
			.uri("/auth/login")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(credentials)
			.exchange()
			.expectStatus().isOk()
			.expectBody()
			.consumeWith(response -> {
				ResponseCookie token = response.getResponseCookies().getFirst(String.valueOf(JWT_COOKIE_NAME));
				String setCookieHeader = response.getResponseHeaders().getFirst(HttpHeaders.SET_COOKIE);

				assertNotNull(token, "JWT token is present in cookie");
				assertNotNull(setCookieHeader, "Cookie has header");
				assertAll(
					() -> assertTrue(token.isHttpOnly(), "Cookie is not accessible by client-side JS"),
					() -> assertTrue(token.isSecure(), "HTTPS cookie"),
					() -> assertTrue(setCookieHeader.contains("SameSite=Strict"), "Only send cookie when request originates from our site")
				);
			});
	}

	@Test
	void jwtContentsAreCorrect() {
		when(accountRepository.findByUsername(any())).thenReturn(Mono.just(encodedAccount));

		webTestClient
			.mutateWith(csrf())
			.post()
			.uri("/auth/login")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(credentials)
			.exchange()
			.expectStatus().isOk()
			.expectBody()
			.consumeWith(response -> {
				ResponseCookie token = response.getResponseCookies().getFirst(String.valueOf(JWT_COOKIE_NAME));

				assertNotNull(token, "JWT token is present in cookie");
				String[] parts = token.getValue().split("\\.");
				assertEquals(3, parts.length, "JWT token has 3 parts: header, payload, signature");

				String decodedPayload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
				JsonNode payload;
				try {
					payload = new ObjectMapper().readTree(decodedPayload);
				} catch (JsonProcessingException e) {
					throw new RuntimeException(e);
				}

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
			});
	}

	@Test
	void securityContextRetention() {
		when(accountRepository.findByUsername(any())).thenReturn(Mono.just(encodedAccount));

		String jwtToken = Objects.requireNonNull(webTestClient
			.mutateWith(csrf())
			.post()
			.uri("/auth/login")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(credentials)
			.exchange()
			.expectStatus().isOk()
			.expectBody(String.class)
			.returnResult()
			.getResponseCookies()
			.getFirst(String.valueOf(JWT_COOKIE_NAME)))
			.getValue();
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

	@Test
	void loginFromLoggedInUser() {
		when(accountRepository.findByUsername(any())).thenReturn(Mono.just(encodedAccount));

		webTestClient
			.mutateWith(csrf())
			.mutateWith(mockJwt()
					.jwt(jwt -> jwt.subject("username"))
					.authorities(createAuthorityList("ROLE_USER")))
			.post()
			.uri("/auth/login")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(credentials)
			.exchange()
			.expectStatus().isOk();
	}

	@Test
	void loginUserNullCredentialsIsBadRequest() {
		webTestClient
			.mutateWith(csrf())
			.post()
			.uri("/auth/login")
			.contentType(MediaType.APPLICATION_JSON)
			.exchange()
			.expectStatus().isBadRequest();
	}

}