package com.blck.central_persistence_service.unitTests.accounts;

import com.blck.central_persistence_service.accounts.AccountAlreadyExistsException;
import com.blck.central_persistence_service.accounts.AccountRepository;
import com.blck.central_persistence_service.accounts.AccountService;
import com.blck.central_persistence_service.accounts.UserAccount;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.context.WebSessionServerSecurityContextRepository;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.Set;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

	@Mock
	AccountRepository accountRepository;

	@Mock
	WebSessionServerSecurityContextRepository securityContextRepository;

	@Mock
	PasswordEncoder passwordEncoder;

	@Mock
	private ReactiveAuthenticationManager reactiveAuthenticationManager;

	@InjectMocks
	AccountService accountService;

	final UserAccount newUserAccount = new UserAccount("123", "username", "password", true, Set.of("USER"));
	final UserAccount existingUserAccount = new UserAccount(null, "username", "encoded", true, Set.of("USER"));

	@BeforeEach
	void setUp() {
		lenient().when(accountRepository.findByUsername(anyString())).thenReturn(Mono.empty());
		lenient().when(passwordEncoder.encode(anyString())).thenReturn("encoded");
		lenient().when(accountRepository.save(any(UserAccount.class))).thenAnswer(i -> Mono.just(i.getArgument(0)));
		lenient().when(securityContextRepository.save(any(), any())).thenReturn(Mono.empty());
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
	void loginFailureProducesErrorResponse() {
		when(reactiveAuthenticationManager.authenticate(any())).thenAnswer(i -> Mono.empty());

		Mono<ResponseEntity<String>> result = accountService.loginUser(null, null, reactiveAuthenticationManager);

		StepVerifier.create(result)
				.expectNextMatches(response -> response.getStatusCode().equals(HttpStatus.UNAUTHORIZED))
				.verifyComplete();
	}

	@Test
	void loginAuthSuccessful() {
		Mono<ResponseEntity<String>> result = accountService.loginUser(null, null, reactiveAuthenticationManager);

		StepVerifier.create(result)
				.expectNextMatches(response -> response.getStatusCode().equals(HttpStatus.OK))
				.verifyComplete();
	}

}
