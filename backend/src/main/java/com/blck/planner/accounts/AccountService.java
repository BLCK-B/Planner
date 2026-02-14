package com.blck.planner.accounts;

import com.blck.planner.accounts.Exceptions.AccountAlreadyExistsException;
import com.blck.planner.security.CredentialsDTO;
import com.blck.planner.security.Roles;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@Primary
public class AccountService implements UserDetailsService {

	private final AccountRepository accountRepository;

	private final PasswordEncoder passwordEncoder;

	@Autowired
	public AccountService(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
		this.accountRepository = accountRepository;
		this.passwordEncoder = passwordEncoder;
	}

    public UserAccount registerUser(CredentialsDTO credentials) throws AccountAlreadyExistsException {
        String username = credentials.username();
        if (accountRepository.findByUsername(username).isPresent()) {
            throw new AccountAlreadyExistsException("Account with username " + username + " already exists");
        }

        Set<String> roles = new HashSet<>();
        roles.add(String.valueOf(Roles.ROLE_PLANNER_USER));

        UserAccount userAccount = new UserAccount(
                null,
                username,
                passwordEncoder.encode(credentials.frontendPasswordHash()),
                credentials.passwordAuthSalt(),
                credentials.encryptionKeySalt(),
                true,
                roles
        );

        return accountRepository.save(userAccount);
    }

    public void loginUser(HttpServletResponse response, Authentication authentication, AuthenticationManager authenticationManager) {
//        Authentication authResponse = authenticationManager.authenticate(authentication);
//
//        JwsHeader header = JwsHeader.with(() -> "HS256").build();
//
//        JwtClaimsSet claims = JwtClaimsSet.builder()
//                .subject(authResponse.getName())
//                .issuedAt(Instant.now())
//                .expiresAt(Instant.now().plus(90, ChronoUnit.DAYS))
//                .claim("roles", authResponse.getAuthorities().stream()
//                        .map(GrantedAuthority::getAuthority).toList())
//                .build();
//
//        String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims))
//                .getTokenValue();
//
//        ResponseCookie cookie = ResponseCookie.from(String.valueOf(JWT_COOKIE_NAME), token)
//                .httpOnly(true) // prevents JS access - against XSS
//                .secure(true) // HTTPS only
//                .sameSite("Strict") // only send cookie when request originates from our site - prevents cross-site requests
//                .path("/")
//                .maxAge(Duration.ofDays(90))
//                .build();
//        response.addHeader("Set-Cookie", cookie.toString());
    }

    @Override
    public UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {
        return accountRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
