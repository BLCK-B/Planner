package com.blck.planner.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken;

@Component
public class CookieAuthenticationConverter {

    public Authentication convert(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;

        for (Cookie cookie : cookies) {
            if (SecurityNames.JWT_COOKIE_NAME.equals(cookie.getName())) {
                String token = cookie.getValue();
                if (token != null && !token.isEmpty()) {
                    return new BearerTokenAuthenticationToken(token);
                }
            }
        }
        return null;
    }
}