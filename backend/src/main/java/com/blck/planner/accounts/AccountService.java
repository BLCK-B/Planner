package com.blck.planner.accounts;

import com.blck.planner.accounts.Exceptions.AccountAlreadyExistsException;
import com.blck.planner.security.CredentialsDTO;
import com.blck.planner.security.Roles;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Set;

import static com.blck.planner.security.SecurityNames.JWT_COOKIE_NAME;

@Service
@Primary
public class AccountService implements UserDetailsService {

	private final AccountRepository accountRepository;

	private final JwtEncoder jwtEncoder;

	private final PasswordEncoder passwordEncoder;

	@Autowired
	public AccountService(AccountRepository accountRepository,
						  JwtEncoder jwtEncoder,
						  PasswordEncoder passwordEncoder) {
		this.accountRepository = accountRepository;
		this.jwtEncoder = jwtEncoder;
		this.passwordEncoder = passwordEncoder;
	}

    public UserAccount registerUser(CredentialsDTO credentials) throws AccountAlreadyExistsException {
        String username = credentials.username();
        if (accountRepository.findByUsername(username).isPresent()) {
            throw new AccountAlreadyExistsException("Account with username " + username + " already exists");
        }

        Set<String> roles = new HashSet<>();
        roles.add(String.valueOf(Roles.ROLE_USER));

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
        Authentication authResponse = authenticationManager.authenticate(authentication);

        JwsHeader header = JwsHeader.with(() -> "HS256").build();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(authResponse.getName())
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plus(1, ChronoUnit.HOURS))
                .claim("roles", authResponse.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority).toList())
                .build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims))
                .getTokenValue();

        ResponseCookie cookie = ResponseCookie.from(String.valueOf(JWT_COOKIE_NAME), token)
                .httpOnly(true) // prevents JS access - against XSS
                .secure(true) // HTTPS only
                .sameSite("Strict") // only send cookie when request originates from our site - prevents cross-site requests
                .path("/")
                .maxAge(Duration.ofHours(1))
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return accountRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
