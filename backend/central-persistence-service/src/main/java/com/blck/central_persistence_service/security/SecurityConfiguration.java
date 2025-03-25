package com.blck.central_persistence_service.security;

import com.blck.central_persistence_service.accounts.AccountService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.WebSessionServerSecurityContextRepository;
import org.springframework.security.web.server.csrf.CookieServerCsrfTokenRepository;
import org.springframework.web.server.session.DefaultWebSessionManager;
import org.springframework.web.server.session.WebSessionManager;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfiguration {

//	@Order(2)
	@Bean
	public SecurityWebFilterChain apiFilterChain(ServerHttpSecurity http) {
		http
				.csrf(csrf -> csrf.csrfTokenRepository(CookieServerCsrfTokenRepository.withHttpOnlyFalse()))
				.securityContextRepository(new WebSessionServerSecurityContextRepository())
				.authorizeExchange(exchanges -> exchanges
						.pathMatchers("/auth/**").permitAll()
						.anyExchange().authenticated()
				);
		return http.build();
	}

//	@Bean
//	public HttpSessionSecurityContextRepository getSecurityContextRepository() {
//		return new HttpSessionSecurityContextRepository();
//	}

	@Bean
	public WebSessionServerSecurityContextRepository securityContextRepository() {
		return new WebSessionServerSecurityContextRepository();
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