package com.blck.planner.integrationTests;

import com.blck.planner.userData.Task;
import com.blck.planner.userData.UserTaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.core.authority.AuthorityUtils.createAuthorityList;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.mockJwt;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
public class UserControllerTests {

	@MockitoBean
	private UserTaskRepository userTaskRepository;

	@Autowired
	private WebTestClient webTestClient;

	@BeforeEach
	public void setup() {
		when(userTaskRepository.findByUserID(any())).thenReturn(Flux.just(new Task("id", "userid", null)));
	}

	@Test
	void unauthenticatedUserIsUnauthorized() {
		webTestClient
			.get()
			.uri("/users/userTasks")
			.exchange()
			.expectStatus().isUnauthorized();
	}

	@Test
	void authenticatedUserWithoutUserRoleIsForbidden() {
		webTestClient
			.mutateWith(mockJwt()
					.jwt(jwt -> jwt.subject("username")))
			.get()
			.uri("/users/userTasks")
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
			.uri("/users/userTasks")
			.exchange()
			.expectStatus().isOk();
	}

}
