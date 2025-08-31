package com.blck.planner.security;

import org.springframework.http.HttpCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken;

import static com.blck.planner.security.SecurityNames.JWT_COOKIE_NAME;

@Component
public class CookieServerAuthenticationConverter implements ServerAuthenticationConverter {

	@Override
	public Mono<Authentication> convert(ServerWebExchange exchange) {
		return Mono.justOrEmpty(exchange
						.getRequest()
						.getCookies()
						.getFirst(String.valueOf(JWT_COOKIE_NAME)))
				.map(HttpCookie::getValue)
				.map(BearerTokenAuthenticationToken::new);
	}
}
