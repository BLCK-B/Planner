package com.blck.planner.security;

import com.blck.planner.accounts.AccountService;
import com.blck.planner.accounts.Exceptions.AccountAlreadyExistsException;
import com.blck.planner.accounts.UserAccount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AccountService accountService;

    @Autowired
    public AuthController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/registerUserSalt")
    public ResponseEntity<UserAccount> register(@AuthenticationPrincipal Jwt jwt, @RequestBody String encryptionKeySalt) {
        try {
            UserAccount user = accountService.registerUserSalt(jwt.getClaim("sub"), encryptionKeySalt);
            return ResponseEntity.ok(user);
        } catch (AccountAlreadyExistsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/encryptionKeySalt")
    public ResponseEntity<String> getEncryptionKeySalt(@AuthenticationPrincipal Jwt jwt) {
        try {
            UserAccount user = (UserAccount) accountService.loadUserByUsername(jwt.getClaim("sub"));
            return ResponseEntity.ok(user.getEncryptionKeySalt());
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/test-sentry")
    public void testSentry() throws Exception {
        throw new Exception("Sentry test.");
    }
}
