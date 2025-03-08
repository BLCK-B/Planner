package com.blck.central_persistence_service.security;

import com.blck.central_persistence_service.accounts.AccountService;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.InMemoryReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.OidcScopes;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoders;
import org.springframework.security.oauth2.server.authorization.client.InMemoryRegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configuration.OAuth2AuthorizationServerConfiguration;
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import com.nimbusds.jose.jwk.RSAKey;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.UUID;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.security.web.server.context.WebSessionServerSecurityContextRepository;

import javax.sql.DataSource;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfiguration {

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

//	@Order(2)
	@Bean
	public SecurityWebFilterChain apiFilterChain(ServerHttpSecurity http) {
		http
				.csrf().disable();
//				.sessionManagement(session -> session
//						.sessionCreationPolicy(SessionCreationPolicy.NEVER)
//						.maximumSessions(1)
//				)
//				.securityContext((securityContext) -> securityContext
//						.requireExplicitSave(true)
//						.securityContextRepository(getSecurityContextRepository())
//				);
		// TODO: fix authorize rules vs level-preauthorize

//				.authorizeHttpRequests((authorize) -> authorize
//						.requestMatchers(HttpMethod.POST,"/auth/login").permitAll()
//						.requestMatchers(HttpMethod.GET, "/users/**").hasAnyRole("USER", "ADMIN")
//						.anyRequest().authenticated()
//				);
		return http.build();
	}

	@Bean
	public HttpSessionSecurityContextRepository getSecurityContextRepository() {
		return new HttpSessionSecurityContextRepository();
	}


	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public ReactiveUserDetailsService userDetailsService(AccountService accountService) {
		return accountService::findByUsername;
	}

	@Bean
	public ReactiveAuthenticationManager reactiveAuthenticationManager(ReactiveUserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
		UserDetailsRepositoryReactiveAuthenticationManager authenticationManager = new UserDetailsRepositoryReactiveAuthenticationManager(userDetailsService);
		authenticationManager.setPasswordEncoder(passwordEncoder);
		return authenticationManager;
	}

	@Bean
	public ReactiveClientRegistrationRepository reactiveClientRegistrationRepository() {
		ClientRegistration oidcClient = ClientRegistration.withRegistrationId("oidc-client")
				.clientId("oidc-client")
				.clientSecret("{noop}secret")
				.clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
				.authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
				.authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
				.redirectUri("http://127.0.0.1:8080/login/oauth2/code/oidc-client")
				.scope(OidcScopes.OPENID)
				.scope(OidcScopes.PROFILE)
				.build();
		return new InMemoryReactiveClientRegistrationRepository(oidcClient);
	}

	@Bean
	public JWKSource<SecurityContext> jwkSource() {
		KeyPair keyPair = generateRsaKey();
		RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
		RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
		RSAKey rsaKey = new RSAKey.Builder(publicKey)
				.privateKey(privateKey)
				.keyID(UUID.randomUUID().toString())
				.build();
		JWKSet jwkSet = new JWKSet(rsaKey);
		return new ImmutableJWKSet<>(jwkSet);
	}

	private static KeyPair generateRsaKey() {
		KeyPair keyPair;
		try {
			KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
			keyPairGenerator.initialize(2048);
			keyPair = keyPairGenerator.generateKeyPair();
		}
		catch (Exception ex) {
			throw new IllegalStateException(ex);
		}
		return keyPair;
	}

	@Bean
	public ReactiveJwtDecoder jwtDecoder() {
		return ReactiveJwtDecoders.fromIssuerLocation("http://localhost:8080");
	}

	@Bean
	public AuthorizationServerSettings authorizationServerSettings() {
		return AuthorizationServerSettings.builder().build();
	}

	//	@Bean
//	public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
//
//		UserDetails userDetails = User.builder()
//				.username("user")
//				.password(passwordEncoder.encode("password"))
//				.roles(String.valueOf(Roles.USER))
//				.build();
//		return new InMemoryUserDetailsManager(userDetails);
//	}

}