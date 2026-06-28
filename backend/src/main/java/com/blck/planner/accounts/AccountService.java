package com.blck.planner.accounts;

import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
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

    public String registerUserSalt(String userId, String salt) {
        UserAccount user = loadUserByUsername(userId);
        user.setEncryptionKeySalt(salt);
        return accountRepository.save(user).getEncryptionKeySalt();
    }


    public UserAccount loadUserByUsername(@NonNull String username) {
        return accountRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public String getEncryptionPhrase(String username) {
        var account = accountRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return account.getEncryptionPhrase();
    }

    public String putEncryptionPhrase(String userId, String encryptionPhrase) {
        UserAccount user = loadUserByUsername(userId);
        user.setEncryptionPhrase(encryptionPhrase);
        return accountRepository.save(user).getEncryptionKeySalt();
    }
}
