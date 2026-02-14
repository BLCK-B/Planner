package com.blck.planner.unitTests.accounts;

import com.blck.planner.accounts.Exceptions.AccountAlreadyExistsException;
import com.blck.planner.accounts.AccountRepository;
import com.blck.planner.accounts.AccountService;
import com.blck.planner.accounts.UserAccount;
import com.blck.planner.security.CredentialsDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtEncoder;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@PreAuthorize("hasRole('ROLE_PLANNER_USER')")
class AccountServiceTest {

	@Mock
	AccountRepository accountRepository;

	@Mock
	JwtEncoder jwtEncoder;

	@Mock
	PasswordEncoder passwordEncoder;

	@Mock
    AuthenticationManager authenticationManager;

	@InjectMocks
	AccountService accountService;

	final UserAccount existingUserAccount = new UserAccount(null, "username", "encoded", "frontendSalt", "encryptionSalt", true, Set.of("ROLE_USER"));

	private final Jwt mockJwt = new Jwt(
		"token-value",
		Instant.now(),
		Instant.now().plusSeconds(3600),
		Map.of("alg", "HS256"),
		Map.of("sub", "testuser", "roles", List.of("ROLE_USER"))
	);

	@BeforeEach
	void setUp() {
		lenient().when(accountRepository.findByUsername(anyString())).thenReturn(Optional.empty());
		lenient().when(passwordEncoder.encode(anyString())).thenReturn("encoded");
		lenient().when(accountRepository.save(any(UserAccount.class))).thenAnswer(i -> i.getArgument(0));
		lenient().when(jwtEncoder.encode(any())).thenReturn(mockJwt);
		lenient().when(authenticationManager.authenticate(any())).thenAnswer(i -> Mockito.mock(Authentication.class));
	}

    @Test
    void registerExceptionWhenUserAlreadyExists() {
        when(accountRepository.findByUsername(anyString())).thenReturn(Optional.of(existingUserAccount));

        assertThrows(AccountAlreadyExistsException.class, () ->
                accountService.registerUser(new CredentialsDTO("username", "password", "frontendSalt", "encryptionSalt")));
    }

    @Test
    void registerAccountHasCorrectData() throws AccountAlreadyExistsException {
        UserAccount user = accountService.registerUser(new CredentialsDTO("username", "password", "frontendSalt", "encryptionSalt"));

        assertAll(
                () -> assertEquals(existingUserAccount.getUsername(), user.getUsername()),
                () -> assertEquals(existingUserAccount.getPassword(), user.getPassword()),
                () -> assertEquals(existingUserAccount.getRoles(), user.getRoles()),
                () -> assertEquals(existingUserAccount.getEncryptionKeySalt(), user.getEncryptionKeySalt()),
                () -> assertEquals(existingUserAccount.getPasswordAuthSalt(), user.getPasswordAuthSalt())
        );
    }

}
