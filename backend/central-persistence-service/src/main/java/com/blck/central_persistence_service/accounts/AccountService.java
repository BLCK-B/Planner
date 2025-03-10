package com.blck.central_persistence_service.accounts;

import com.blck.central_persistence_service.security.Roles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.context.WebSessionServerSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.HashSet;
import java.util.Set;

@Service
@Primary
	public class AccountService implements ReactiveUserDetailsService {

	private final AccountRepository accountRepository;

	private final WebSessionServerSecurityContextRepository securityContextRepository;

	private final PasswordEncoder passwordEncoder;

	@Autowired
	public AccountService(AccountRepository accountRepository,
						  WebSessionServerSecurityContextRepository securityContextRepository,
						  PasswordEncoder passwordEncoder) {
		this.accountRepository = accountRepository;
		this.securityContextRepository = securityContextRepository;
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
					roles.add(String.valueOf(Roles.USER));
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

	// TODO: custom exception and invoke response from controller
	public Mono<ResponseEntity<String>> loginUser(ServerWebExchange exchange,
												  Authentication authRequest,
												  ReactiveAuthenticationManager reactiveAuthenticationManager) {
		return reactiveAuthenticationManager.authenticate(authRequest)
				.flatMap(authResponse -> {
					SecurityContext securityContext = new SecurityContextImpl(authResponse);
					return securityContextRepository.save(exchange, securityContext)
							.then(Mono.just(ResponseEntity.ok("Authentication successful")));
				})
				.switchIfEmpty(Mono.just(new ResponseEntity<>("Authentication failure", HttpStatus.UNAUTHORIZED)))
				.onErrorResume(e -> Mono.just(new ResponseEntity<>("Authentication failure: " + e.getMessage(), HttpStatus.UNAUTHORIZED)));
	}

	@Override
	public Mono<UserDetails> findByUsername(String username) {
		return accountRepository.findByUsername(username)
				.switchIfEmpty(Mono.error(new UsernameNotFoundException(username)))
				.map(userAccount -> userAccount);
	}
}
