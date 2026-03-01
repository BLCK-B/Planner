package com.blck.planner.accounts;

import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Primary
public class AccountService {

	private final AccountRepository accountRepository;

	@Autowired
	public AccountService(AccountRepository accountRepository) {
		this.accountRepository = accountRepository;
	}

    public UserAccount registerAccount(String userId) {
        UserAccount userAccount = new UserAccount(null, userId, null, true);

        return accountRepository.save(userAccount);
    }

    public UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {
        return (UserDetails) accountRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
