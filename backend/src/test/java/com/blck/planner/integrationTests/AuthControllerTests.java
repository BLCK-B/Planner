package com.blck.planner.integrationTests;

import com.blck.planner.accounts.AccountRepository;
import com.blck.planner.accounts.UserAccount;
import com.blck.planner.security.CredentialsDTO;
import com.blck.planner.security.SecurityNames;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.charset.StandardCharsets;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.core.authority.AuthorityUtils.createAuthorityList;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:/test-variables.properties")
class AuthControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    AccountRepository accountRepository;

    final ObjectMapper objectMapper = new ObjectMapper();
    CredentialsDTO credentials = new CredentialsDTO("username", "password", "frontendSalt", "encryptionSalt");

    final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
    final UserAccount existingUserAccount = new UserAccount(null, "username", "password", "frontendSalt", "encryptionSalt", true, Set.of("ROLE_USER"));
    final UserAccount encodedAccount = new UserAccount(null, "username", bCryptPasswordEncoder.encode("password"), "frontendSalt", "encryptionSalt", true, Set.of("ROLE_USER"));
    final UserAccount encodedAccountDiffPswd = new UserAccount(null, "username", bCryptPasswordEncoder.encode("different"), "frontendSalt", "encryptionSalt", true, Set.of("ROLE_USER"));

    @Test
    void registerUserSuccess() throws Exception {
        when(accountRepository.findByUsername(any())).thenReturn(Optional.empty());
        when(accountRepository.save(any(UserAccount.class))).thenReturn(existingUserAccount);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("username"))
                .andExpect(jsonPath("$.password").value("password"))
                .andExpect(jsonPath("$.roles[0]").value("ROLE_USER"));
    }

    @Test
    void registerExistingUserReturnsConlict() throws Exception {
        when(accountRepository.findByUsername(any())).thenReturn(Optional.of(existingUserAccount));
        when(accountRepository.save(any(UserAccount.class))).thenReturn(existingUserAccount);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isConflict())
                .andExpect(content().string(""));
    }

    @Test
    void registerExistingUserReturnsConlictDiffPasswordCheck() throws Exception {
        when(accountRepository.findByUsername(any())).thenReturn(Optional.of(existingUserAccount));
        when(accountRepository.save(any(UserAccount.class))).thenReturn(encodedAccountDiffPswd);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isConflict())
                .andExpect(content().string(""));
    }

    @Test
    void registerUserFromLoggedInUser() throws Exception {
        when(accountRepository.findByUsername(any())).thenReturn(Optional.empty());
        when(accountRepository.save(any(UserAccount.class))).thenReturn(existingUserAccount);

        mockMvc.perform(post("/auth/register")
                        .with(jwt().jwt(jwt -> jwt.subject("username"))
                                .authorities(createAuthorityList("ROLE_USER")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("username"))
                .andExpect(jsonPath("$.password").value("password"))
                .andExpect(jsonPath("$.roles[0]").value("ROLE_USER"));
    }

    @Test
    void registerUserNullCredentialsIsBadRequest() throws Exception {
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void authSaltWhenUserDoesntExistReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/auth/authSalt/userThatDoesntExist")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginUserSuccess() throws Exception {
        when(accountRepository.findByUsername(any())).thenReturn(Optional.of(encodedAccount));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk());
    }

    @Test
    void loginUserWrongCredentialsReturnsUnauthorized() throws Exception {
        when(accountRepository.findByUsername(any())).thenReturn(Optional.of(encodedAccount));
        credentials = new CredentialsDTO("username", "wrongPassword", "frontendSalt", "encryptionSalt");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void jwtIsNotEmbeddedInResponseBodyOrHeader() throws Exception {
        when(accountRepository.findByUsername(any())).thenReturn(Optional.of(encodedAccount));

        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpServletResponse response = result.getResponse();
        String body = response.getContentAsString(StandardCharsets.UTF_8);
        String authHeader = response.getHeader(HttpHeaders.AUTHORIZATION);

        assertEquals("encryptionSalt", body);
        assertNull(authHeader);
    }

    @Test
    void jwtIsInSecureCookie() throws Exception {
        when(accountRepository.findByUsername(any())).thenReturn(Optional.of(encodedAccount));

        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andReturn();

        Cookie token = result.getResponse().getCookie(String.valueOf(SecurityNames.JWT_COOKIE_NAME));
        String setCookieHeader = result.getResponse().getHeader(HttpHeaders.SET_COOKIE);

        assertNotNull(token, "JWT token is present in cookie");
        assertNotNull(setCookieHeader, "Cookie has header");
        assertTrue(token.isHttpOnly(), "Cookie is not accessible by client-side JS");
        assertTrue(token.getSecure(), "HTTPS cookie");
        assertTrue(setCookieHeader.contains("SameSite=Strict"), "Only send cookie when request originates from our site");
    }

    @Test
    void jwtContentsAreCorrect() throws Exception {
        when(accountRepository.findByUsername(any())).thenReturn(Optional.of(encodedAccount));

        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andReturn();

        Cookie token = result.getResponse().getCookie(String.valueOf(SecurityNames.JWT_COOKIE_NAME));
        assertNotNull(token, "JWT token is present in cookie");

        String[] parts = token.getValue().split("\\.");
        assertEquals(3, parts.length, "JWT token has 3 parts: header, payload, signature");

        String decodedPayload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
        JsonNode payload = objectMapper.readTree(decodedPayload);

        assertEquals("username", payload.get("sub").asString());
        assertTrue(payload.hasNonNull("iat"));
        assertTrue(payload.hasNonNull("exp"));
        List<String> roles = new ArrayList<>();
        payload.get("roles").forEach(node -> roles.add(node.asString()));
        assertTrue(roles.contains("ROLE_USER"));
    }

    @Test
    void securityContextRetention() throws Exception {
        when(accountRepository.findByUsername(any())).thenReturn(Optional.of(encodedAccount));

        MvcResult loginResult = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andReturn();

        Cookie jwtCookie = loginResult.getResponse().getCookie(String.valueOf(SecurityNames.JWT_COOKIE_NAME));
        assertNotNull(jwtCookie);
        mockMvc.perform(get("/users/userAccountInfo")
                        .cookie(jwtCookie))
                .andExpect(status().isOk())
                .andExpect(content().string(encodedAccount.getUsername()));
    }

    @Test
    void loginFromLoggedInUser() throws Exception {
        when(accountRepository.findByUsername(any())).thenReturn(Optional.of(encodedAccount));

        mockMvc.perform(post("/auth/login")
                        .with(jwt().jwt(jwt -> jwt.subject("username"))
                                .authorities(createAuthorityList("ROLE_USER")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk());
    }

    @Test
    void loginUserNullCredentialsIsBadRequest() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

}