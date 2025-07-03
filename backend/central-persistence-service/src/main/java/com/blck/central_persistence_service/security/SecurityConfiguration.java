package com.blck.central_persistence_service.security;

import com.blck.central_persistence_service.accounts.AccountService;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.OctetSequenceKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Collection;

// security TODO:
// JWT key as secret - use providers' for OAUTH?
// rate limiting

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfiguration {

//	@Order(2)
	@Bean
	public SecurityWebFilterChain apiFilterChain(ServerHttpSecurity http) {
		http
//				.csrf(csrf -> csrf.csrfTokenRepository(CookieServerCsrfTokenRepository.withHttpOnlyFalse()))
				.csrf(ServerHttpSecurity.CsrfSpec::disable)
				.oauth2ResourceServer(oauth2 -> oauth2
					.jwt(jwt -> jwt.jwtAuthenticationConverter(
							new ReactiveJwtAuthenticationConverterAdapter(jwtGrantedAuthoritiesConverter())
					))
//					.jwt(Customizer.withDefaults())
				)
				.securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
				.authorizeExchange(exchanges -> exchanges
						.pathMatchers("/auth/**").permitAll()
						.anyExchange().authenticated()
				);
		return http.build();
	}

	private Converter<Jwt, AbstractAuthenticationToken> jwtGrantedAuthoritiesConverter() {
		JwtGrantedAuthoritiesConverter converter = new JwtGrantedAuthoritiesConverter();
		converter.setAuthoritiesClaimName("roles");
		converter.setAuthorityPrefix("");
		return jwt -> {
			Collection<GrantedAuthority> authorities = converter.convert(jwt);
			return new JwtAuthenticationToken(jwt, authorities);
		};
	}

	@Bean
	public JwtEncoder jwtEncoder() {
		String jwtSecret = "12345678901234567890123456789012";
		SecretKeySpec secretKey = new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
		OctetSequenceKey jwk = new OctetSequenceKey.Builder(secretKey).build();
		JWKSource<SecurityContext> jwkSource = new ImmutableJWKSet<>(new JWKSet(jwk));
		return new NimbusJwtEncoder(jwkSource);
	}

	@Bean
	public ReactiveJwtDecoder reactiveJwtDecoder() {
		String jwtSecret = "12345678901234567890123456789012";
		SecretKeySpec secretKey = new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
		return NimbusReactiveJwtDecoder.withSecretKey(secretKey).build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public ReactiveUserDetailsService userDetailsService(AccountService accountService) {
		return accountService;
	}

	@Bean
	public ReactiveAuthenticationManager reactiveAuthenticationManager(ReactiveUserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
		UserDetailsRepositoryReactiveAuthenticationManager authenticationManager = new UserDetailsRepositoryReactiveAuthenticationManager(userDetailsService);
		authenticationManager.setPasswordEncoder(passwordEncoder);
		return authenticationManager;
	}

// TODO: OIDC below
//	@Bean
//	@Order(1)
//	public SecurityFilterChain authorizationServerSecurityFilterChain(HttpSecurity http) throws Exception {
//		OAuth2AuthorizationServerConfigurer authorizationServerConfigurer = OAuth2AuthorizationServerConfigurer.authorizationServer();
//		http
//				.securityMatcher(authorizationServerConfigurer.getEndpointsMatcher())
//				.with(authorizationServerConfigurer, (authorizationServer) ->
//						authorizationServer
//								.oidc(Customizer.withDefaults())	// Enable OpenID Connect 1.0
//				)
//				.authorizeHttpRequests((authorize) ->
//						authorize
//								.anyRequest().authenticated()
//				)
//				// Redirect to the login page when not authenticated from the
//				// authorization endpoint
//				.exceptionHandling((exceptions) -> exceptions
//						.defaultAuthenticationEntryPointFor(
//								new LoginUrlAuthenticationEntryPoint("/login"),
//								new MediaTypeRequestMatcher(MediaType.TEXT_HTML)
//						)
//				);
//
//		return http.build();
//	}
//
//	@Bean
//	public ReactiveClientRegistrationRepository reactiveClientRegistrationRepository() {
//		ClientRegistration oidcClient = ClientRegistration.withRegistrationId("oidc-client")
//				.clientId("oidc-client")
//				.clientSecret("{noop}secret")
//				.clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
//				.authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
//				.authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
//				.redirectUri("http://127.0.0.1:8080/login/oauth2/code/oidc-client")
//				.scope(OidcScopes.OPENID)
//				.scope(OidcScopes.PROFILE)
//				.build();
//		return new InMemoryReactiveClientRegistrationRepository(oidcClient);
//	}
//
//	@Bean
//	public JWKSource<SecurityContext> jwkSource() {
//		KeyPair keyPair = generateRsaKey();
//		RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
//		RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
//		RSAKey rsaKey = new RSAKey.Builder(publicKey)
//				.privateKey(privateKey)
//				.keyID(UUID.randomUUID().toString())
//				.build();
//		JWKSet jwkSet = new JWKSet(rsaKey);
//		return new ImmutableJWKSet<>(jwkSet);
//	}
//
//	private static KeyPair generateRsaKey() {
//		KeyPair keyPair;
//		try {
//			KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
//			keyPairGenerator.initialize(2048);
//			keyPair = keyPairGenerator.generateKeyPair();
//		}
//		catch (Exception ex) {
//			throw new IllegalStateException(ex);
//		}
//		return keyPair;
//	}
//
//	@Bean
//	public ReactiveJwtDecoder jwtDecoder() {
//		return ReactiveJwtDecoders.fromIssuerLocation("http://localhost:8080/.well-known/openid-configuration");
//	}
//
//	@Bean
//	public AuthorizationServerSettings authorizationServerSettings() {
//		return AuthorizationServerSettings.builder().build();
//	}

}