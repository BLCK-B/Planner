package com.blck.central_persistence_service.accounts;

import com.blck.central_persistence_service.accounts.Exceptions.AccountAlreadyExistsException;
import com.blck.central_persistence_service.security.Roles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Set;

@Service
@Primary
public class AccountService implements ReactiveUserDetailsService {

	private final AccountRepository accountRepository;

	private final JwtEncoder jwtEncoder;

	private final PasswordEncoder passwordEncoder;

	@Autowired
	public AccountService(AccountRepository accountRepository,
						  JwtEncoder jwtEncoder,
						  PasswordEncoder passwordEncoder) {
		this.accountRepository = accountRepository;
		this.jwtEncoder = jwtEncoder;
		this.passwordEncoder = passwordEncoder;
	}

	public Mono<UserAccount> registerUser(String username, String password) {
		return accountRepository.findByUsername(username)
			.hasElement()
			.flatMap(hasAccount -> {
				if (hasAccount) {
					return Mono.error(new AccountAlreadyExistsException("Account with username " + username + " already exists"));
				}
				Set<String> roles = new HashSet<>();
				roles.add(String.valueOf(Roles.ROLE_USER));
				UserAccount userAccount = new UserAccount(
						null,
						username,
						passwordEncoder.encode(password),
						true,
						roles
				);
				return accountRepository.save(userAccount);
			});
	}

	public Mono<String> loginUser(Authentication authentication,
								  ReactiveAuthenticationManager reactiveAuthenticationManager) {
		return reactiveAuthenticationManager.authenticate(authentication)
				.flatMap(authResponse -> {
					JwsHeader header = JwsHeader.with(() -> "HS256").build();

					JwtClaimsSet claims = JwtClaimsSet.builder()
						.subject(authResponse.getName())
						.issuedAt(Instant.now())
						.expiresAt(Instant.now().plus(1, ChronoUnit.HOURS))
						.claim("roles", authResponse.getAuthorities().stream()
							.map(GrantedAuthority::getAuthority).toList())
						.build();

					String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims))
							.getTokenValue();
					return Mono.just(token);
				});
	}

	@Override
	public Mono<UserDetails> findByUsername(String username) {
		return accountRepository.findByUsername(username)
			.map(userAccount -> userAccount);
	}
}
