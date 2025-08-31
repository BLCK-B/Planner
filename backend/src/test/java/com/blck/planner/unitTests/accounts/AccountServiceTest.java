package com.blck.planner.unitTests.accounts;

import com.blck.planner.accounts.Exceptions.AccountAlreadyExistsException;
import com.blck.planner.accounts.AccountRepository;
import com.blck.planner.accounts.AccountService;
import com.blck.planner.accounts.UserAccount;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@PreAuthorize("hasRole('USER')")
class AccountServiceTest {

	@Mock
	AccountRepository accountRepository;

	@Mock
	JwtEncoder jwtEncoder;

	@Mock
	PasswordEncoder passwordEncoder;

	@Mock
	ReactiveAuthenticationManager reactiveAuthenticationManager;

	@InjectMocks
	AccountService accountService;

	final UserAccount existingUserAccount = new UserAccount(null, "username", "encoded", true, Set.of("ROLE_USER"));

	private final Jwt mockJwt = new Jwt(
		"token-value",
		Instant.now(),
		Instant.now().plusSeconds(3600),
		Map.of("alg", "HS256"),
		Map.of("sub", "testuser", "roles", List.of("ROLE_USER"))
	);

	@BeforeEach
	void setUp() {
		lenient().when(accountRepository.findByUsername(anyString())).thenReturn(Mono.empty());
		lenient().when(passwordEncoder.encode(anyString())).thenReturn("encoded");
		lenient().when(accountRepository.save(any(UserAccount.class))).thenAnswer(i -> Mono.just(i.getArgument(0)));
		lenient().when(jwtEncoder.encode(any())).thenReturn(mockJwt);
		lenient().when(reactiveAuthenticationManager.authenticate(any())).thenAnswer(i -> Mono.just(Mockito.mock(Authentication.class)));
	}

	@Test
	void registerExceptionWhenUserAlreadyExists() {
		when(accountRepository.findByUsername(anyString())).thenReturn(Mono.just(existingUserAccount));

		Mono<UserAccount> result = accountService.registerUser("username", "password");

		StepVerifier.create(result)
			.expectError(AccountAlreadyExistsException.class)
			.verify();
	}

	@Test
	void registerAccountHasCorrectData() {
		Mono<UserAccount> result = accountService.registerUser("username", "password");

		StepVerifier.create(result)
			.expectNextMatches(user -> user.equals(existingUserAccount))
			.verifyComplete();
	}

}
