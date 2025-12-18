package com.blck.planner.security;

import com.blck.planner.accounts.AccountService;
import com.blck.planner.accounts.Exceptions.AccountAlreadyExistsException;
import com.blck.planner.accounts.UserAccount;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AccountService accountService;

    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthController(AccountService accountService, AuthenticationManager authenticationManager) {
        this.accountService = accountService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<UserAccount> register(@RequestBody CredentialsDTO credentials) {
        try {
            UserAccount user = accountService.registerUser(credentials);
            return ResponseEntity.ok(user);
        } catch (AccountAlreadyExistsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/authSalt/{username}")
    public ResponseEntity<String> getFrontendHashSalt(@PathVariable String username) {
        UserAccount user = (UserAccount) accountService.loadUserByUsername(username);
        if (user != null) {
            return ResponseEntity.ok(user.getPasswordAuthSalt());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * @return encryption key salt on success
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody CredentialsDTO credentials, HttpServletRequest request, HttpServletResponse response) {
        Authentication authRequest = new UsernamePasswordAuthenticationToken(
                credentials.username(),
                credentials.frontendPasswordHash()
        );
        try {
            accountService.loginUser(response, authRequest, authenticationManager);
            UserAccount user = (UserAccount) accountService.loadUserByUsername(credentials.username());
            if (user != null) {
                return ResponseEntity.ok(user.getEncryptionKeySalt());
            }
            return ResponseEntity.notFound().build();
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }

}
