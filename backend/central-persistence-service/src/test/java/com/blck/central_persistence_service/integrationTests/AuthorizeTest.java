package com.blck.central_persistence_service.integrationTests;

import com.blck.central_persistence_service.accounts.AccountRepository;
import com.blck.central_persistence_service.accounts.AccountService;
import com.blck.central_persistence_service.accounts.UserAccount;
import com.blck.central_persistence_service.userData.UserItem;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;

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
	final UserAccount encodedAccount = new UserAccount(null, "username", bCryptPasswordEncoder.encode("password"), true, Set.of("USER"));

	@Test
	void unauthUserShouldNotAccessUserController() {
		webTestClient
				.mutateWith(csrf())
				.get()
				.uri("/users/loadItems")
				.exchange()
				.expectStatus().isUnauthorized();
	}

	@Test
	@WithMockUser(username = "username", roles = "USER")
	void authUserIsAbleToAccessUserController() {
		webTestClient
				.mutateWith(csrf())
				.get()
				.uri("/users/loadItems")
				.exchange()
				.expectStatus().isOk();
	}

	@Test
	void securityContextIsPopulatedOnLogin() {
		when(accountRepository.findByUsername(any())).thenReturn(Mono.just(encodedAccount));

		webTestClient
				.mutateWith(csrf())
				.post()
				.uri("/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.bodyValue(credentials)
				.exchange()
				.expectStatus().isOk();

		webTestClient
				.mutateWith(csrf())
				.get()
				.uri("/users/userAccountInfo")
				.exchange()
				.expectStatus().isOk()
				.expectBody(UserAccount.class)
				.value(userAccount -> {
					assertNotNull(userAccount.getUsername());
					assertEquals(encodedAccount.getUsername(), userAccount.getUsername());
				});
	}

	@Test
	void securityContextRetention() {
		when(accountRepository.findByUsername(any())).thenReturn(Mono.just(encodedAccount));

		webTestClient
				.mutateWith(csrf())
				.post()
				.uri("/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.bodyValue(credentials)
				.exchange()
				.expectStatus().isOk();
		webTestClient
				.mutateWith(csrf())
				.get()
				.uri("/users/userAccountInfo")
				.exchange()
				.expectStatus().isOk()
				.expectBodyList(UserItem.class)
				.hasSize(0);
	}

}
