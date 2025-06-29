package com.blck.central_persistence_service.unitTests.accounts;

import com.blck.central_persistence_service.accounts.Exceptions.AccountAlreadyExistsException;
import com.blck.central_persistence_service.accounts.AccountRepository;
import com.blck.central_persistence_service.accounts.AccountService;
import com.blck.central_persistence_service.accounts.UserAccount;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
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

	final UserAccount existingUserAccount = new UserAccount(null, "username", "encoded", true, Set.of("USER"));

	private Jwt mockJwt = new Jwt(
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

	@Test
	void loginFailureWhenAccountNotFoundOrBadCredentials() {
		// AbstractUserDetailsReactiveAuthenticationManager does not differentiate between these cases
		when(reactiveAuthenticationManager.authenticate(any()))
				.thenAnswer(i -> Mono.error(new BadCredentialsException("Invalid credentials")));

		Mono<String> result = accountService.loginUser(null, reactiveAuthenticationManager);

		StepVerifier.create(result)
				.expectError(BadCredentialsException.class)
				.verify();
	}

	@Test
	void loginAuthSuccessful() {
		Mono<String> result = accountService.loginUser( null, reactiveAuthenticationManager);

		StepVerifier.create(result)
				.expectNext("Authentication successful")
				.verifyComplete();
	}

}
