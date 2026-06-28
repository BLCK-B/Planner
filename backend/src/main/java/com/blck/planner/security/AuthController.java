package com.blck.planner.security;

import com.blck.planner.accounts.AccountService;
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

    // todo: preauthorize
    @GetMapping("/encryptionKeySalt")
    public ResponseEntity<String> getEncryptionKeySalt(@AuthenticationPrincipal Jwt jwt) {
        try {
            UserAccount user = accountService.loadUserByUsername(jwt.getSubject());
            return ResponseEntity.ok(user.getEncryptionKeySalt());
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // todo: preauthorize
    @PostMapping("/registerUserSalt")
    public ResponseEntity<String> registerUserSalt(@AuthenticationPrincipal Jwt jwt, @RequestBody String encryptionKeySalt) {
        try {
            String salt = accountService.registerUserSalt(jwt.getClaim("sub"), encryptionKeySalt);
            return ResponseEntity.ok(salt);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    // todo: preauthorize
    @GetMapping("/test-sentry")
    public void testSentry() throws Exception {
        throw new Exception("Sentry test.");
    }

    // todo: preauthorize
    @GetMapping("/encryptionPhrase")
    public String getEncryptionPhrase(@AuthenticationPrincipal Jwt jwt) {
        return accountService.getEncryptionPhrase(jwt.getClaim("sub"));
    }

    // todo: preauthorize
    @PutMapping("/encryptionPhrase")
    public String putEncryptionPhrase(@AuthenticationPrincipal Jwt jwt, @RequestBody String encryptionPhrase) {
        return accountService.putEncryptionPhrase(jwt.getClaim("sub"), encryptionPhrase);
    }
}
