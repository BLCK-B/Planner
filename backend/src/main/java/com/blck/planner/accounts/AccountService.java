package com.blck.planner.accounts;

import com.blck.planner.accounts.Exceptions.AccountAlreadyExistsException;
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

    public UserAccount registerUserSalt(String userId, String encryptionKeySalt) throws AccountAlreadyExistsException {
        if (accountRepository.findByUsername(userId).isPresent()) {
            throw new AccountAlreadyExistsException("Account with username " + userId + " already exists");
        }

        UserAccount userAccount = new UserAccount(null, userId, encryptionKeySalt, true);

        return accountRepository.save(userAccount);
    }

    public UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {
        return (UserDetails) accountRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
