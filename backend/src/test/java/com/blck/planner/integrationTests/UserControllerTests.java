package com.blck.planner.integrationTests;

import com.blck.planner.userData.Plan.Plan;
import com.blck.planner.userData.Task.Task;
import com.blck.planner.userData.Task.UserTaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
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
public class UserControllerTests {

    @MockitoBean
    private UserTaskRepository userTaskRepository;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        when(userTaskRepository.findByUserID(any()))
                .thenReturn(List.of(new Task(UUID.randomUUID(), "userid", "", "", "", null, "", 0, Set.of(), null)));
    }

    @Test
    void unauthenticatedUserIsUnauthorized() throws Exception {
        mockMvc.perform(get("/users/userTasks")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void authenticatedUserWithoutUserRoleIsForbidden() throws Exception {
        mockMvc.perform(get("/users/userTasks")
                        .with(jwt().jwt(jwt -> jwt.subject("username")))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void authenticatedUserHasAccess() throws Exception {
        mockMvc.perform(get("/users/userTasks")
                        .with(jwt().jwt(jwt -> jwt.subject("username"))
                                .authorities(() -> "ROLE_USER"))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

}
