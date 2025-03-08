package com.blck.central_persistence_service.accounts;

import com.blck.central_persistence_service.security.Roles;
import com.blck.central_persistence_service.userData.UserRepository;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.HashSet;
import java.util.Set;

@Service
@Primary
	public class AccountService implements ReactiveUserDetailsService {

	private final AccountRepository accountRepository;

	private final PasswordEncoder passwordEncoder;

	public AccountService(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
		this.accountRepository = accountRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public Mono<UserAccount> registerUser(String username, String password) {
		if (accountRepository.findByUsername(username) == null) {
			System.out.println("account already exists");
			return null;
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
	}

	@Override
	public Mono<UserDetails> findByUsername(String username) {
		return accountRepository.findByUsername(username)
				.switchIfEmpty(Mono.error(new UsernameNotFoundException(username)))
				.map(userAccount -> userAccount);
	}
}
