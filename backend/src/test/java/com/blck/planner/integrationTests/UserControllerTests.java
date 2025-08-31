package com.blck.planner.integrationTests;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.springframework.security.core.authority.AuthorityUtils.createAuthorityList;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.mockJwt;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
public class UserControllerTests {

	@Autowired
	private WebTestClient webTestClient;

	@Test
	void unauthenticatedUserIsUnauthorized() {
		webTestClient
			.get()
			.uri("/users/loadItems")
			.exchange()
			.expectStatus().isUnauthorized();
	}

	@Test
	void authenticatedUserWithoutUserRoleIsForbidden() {
		webTestClient
			.mutateWith(mockJwt()
					.jwt(jwt -> jwt.subject("username")))
			.get()
			.uri("/users/loadItems")
			.exchange()
			.expectStatus().isForbidden();
	}

	@Test
	void authenticatedUserHasAccess() {
		webTestClient
			.mutateWith(mockJwt()
					.jwt(jwt -> jwt.subject("username"))
					.authorities(createAuthorityList("ROLE_USER")))
			.get()
			.uri("/users/loadItems")
			.exchange()
			.expectStatus().isOk();
	}

}
