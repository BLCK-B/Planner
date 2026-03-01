package com.blck.planner.integrationTests;

import com.blck.planner.userData.Task.Task;
import com.blck.planner.userData.Task.UserTaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:/test-variables.properties")
public class UserControllerTests {

    @MockitoBean
    private UserTaskRepository userTaskRepository;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        when(userTaskRepository.findByUserID(any()))
                .thenReturn(List.of(new Task(UUID.randomUUID(), "userid", "", "", null, "", 0, false, Set.of())));
    }

    @Test
    void unauthenticatedUserIsUnauthorized() throws Exception {
        mockMvc.perform(get("/users/uncompletedUserTasks")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void authenticatedUserHasAccess() throws Exception {
        mockMvc.perform(get("/users/uncompletedUserTasks")
                        .with(jwt().jwt(jwt -> jwt.subject("username"))
                                .authorities(() -> "ROLE_USER"))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

}
