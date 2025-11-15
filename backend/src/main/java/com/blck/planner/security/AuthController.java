package com.blck.planner.security;

import com.blck.planner.accounts.AccountService;
import com.blck.planner.accounts.Exceptions.AccountAlreadyExistsException;
import com.blck.planner.accounts.UserAccount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AccountService accountService;

    private final ReactiveAuthenticationManager reactiveAuthenticationManager;

    @Autowired
    public AuthController(AccountService accountService, ReactiveAuthenticationManager reactiveAuthenticationManager) {
        this.accountService = accountService;
        this.reactiveAuthenticationManager = reactiveAuthenticationManager;
    }

    @PostMapping("/register")
    public Mono<ResponseEntity<UserAccount>> register(@RequestBody CredentialsDTO credentials) {
        return accountService.registerUser(credentials)
                .map(ResponseEntity::ok)
                .onErrorResume(AccountAlreadyExistsException.class, ex ->
                        Mono.just(ResponseEntity.status(HttpStatus.CONFLICT).body(null))
                )
                .defaultIfEmpty(ResponseEntity.badRequest().build());
    }

    @GetMapping("/authSalt/{username}")
    public Mono<ResponseEntity<String>> getFrontendHashSalt(@PathVariable String username) {
        return accountService.findByUsername(username)
                .map(userAccount -> ResponseEntity.ok(((UserAccount) userAccount).passwordAuthSalt()))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * @return encryption key salt on success
     */
    @PostMapping("/login")
    public Mono<ResponseEntity<String>> login(@RequestBody CredentialsDTO credentials, ServerWebExchange exchange) {
        Authentication authRequest = new UsernamePasswordAuthenticationToken(
                credentials.username(),
                credentials.frontendPasswordHash()
        );
        return accountService.loginUser(exchange, authRequest, reactiveAuthenticationManager)
                .flatMap(token ->
                        accountService.findByUsername(credentials.username())
                                .map(userAccount -> ResponseEntity.ok(((UserAccount) userAccount).encryptionKeySalt()))
                                .defaultIfEmpty(ResponseEntity.notFound().build())
                )
                .onErrorResume(BadCredentialsException.class, e ->
                        Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage()))
                )
                .onErrorResume(RuntimeException.class, e ->
                        Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage()))
                );
    }

}
