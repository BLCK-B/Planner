package com.blck.planner.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.ResponseCookie;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Collection;
import java.util.List;

import static com.blck.planner.security.SecurityNames.JWT_COOKIE_NAME;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @Bean
    public SecurityFilterChain apiFilterChain(HttpSecurity http, JwtDecoder jwtDecoder, CookieAuthenticationConverter cookieAuthenticationConverter, OAuth2AuthorizedClientService authorizedClientService) {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(_ -> {
                    CorsConfiguration configuration = new CorsConfiguration();
                    configuration.setAllowedOrigins(List.of(frontendUrl));
                    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    configuration.setAllowCredentials(true);
                    configuration.setAllowedHeaders(List.of("*"));
                    return configuration;
                }))
                .authorizeHttpRequests(exchanges -> exchanges
                        .requestMatchers(  "/auth/**", "/oauth2/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(cookieAuthenticationWebFilter(jwtDecoder, cookieAuthenticationConverter), UsernamePasswordAuthenticationFilter.class)
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                )
                .oauth2Login(Customizer.withDefaults())
                .oauth2Login(oauth2 -> oauth2
                        .successHandler((_, response, auth) -> {
                            OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient("zitadel", auth.getName());
                            String jwt = client.getAccessToken().getTokenValue();
                            ResponseCookie cookie = ResponseCookie.from(String.valueOf(JWT_COOKIE_NAME), jwt)
                                    .httpOnly(true) // prevents JS access - against XSS
                                    .secure(true) // HTTPS only
                                    .sameSite("None") // ~~only send cookie when request originates from our site - prevents cross-site requests~~
                                    .path("/")
                                    .maxAge(Duration.ofDays(90))
                                    .build();
                            response.addHeader("Set-Cookie", cookie.toString());
                        })
                )
                .oauth2Client(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter());
        return converter;
    }

    private Converter<@NonNull Jwt, @NonNull Collection<GrantedAuthority>> jwtGrantedAuthoritiesConverter() {
        JwtGrantedAuthoritiesConverter converter = new JwtGrantedAuthoritiesConverter();
        converter.setAuthoritiesClaimName("groups");
        converter.setAuthorityPrefix("");
        return jwt -> converter.convert(jwt).stream()
                .filter(auth -> Roles.doesRoleExist(auth.getAuthority()))
                .toList();
    }

    @Bean
    public OncePerRequestFilter cookieAuthenticationWebFilter(JwtDecoder jwtDecoder, CookieAuthenticationConverter cookieAuthenticationConverter) {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(
                    @NonNull HttpServletRequest request,
                    @NonNull HttpServletResponse response,
                    @NonNull FilterChain filterChain)
                    throws ServletException, IOException {
                Authentication auth = cookieAuthenticationConverter.convert(request);
                if (auth instanceof BearerTokenAuthenticationToken tokenAuth) {
                    try {
                        Jwt jwt = jwtDecoder.decode(tokenAuth.getToken());
                        JwtAuthenticationToken authentication =
                                new JwtAuthenticationToken(jwt, jwtGrantedAuthoritiesConverter().convert(jwt));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    } catch (JwtException e) {
                        SecurityContextHolder.clearContext();
                    }
                }
                filterChain.doFilter(request, response);
            }
        };
    }
    // todo: from properties
    @Bean
    public JwtDecoder jwtDecoder() {
        return JwtDecoders.fromIssuerLocation("https://auth.spruits.eu");
    }
}