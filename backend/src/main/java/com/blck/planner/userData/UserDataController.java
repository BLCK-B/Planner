package com.blck.planner.userData;

import com.blck.planner.userData.Tag.UserTagRepository;
import com.blck.planner.userData.Task.Task;
import com.blck.planner.userData.Task.UserTaskRepository;
import com.blck.planner.userData.WorkItem.UserWorkItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserDataController {

    private final UserTaskRepository userTaskRepository;
    private final UserTagRepository userTagRepository;
    private final UserWorkItemRepository userWorkItemRepository;

    @Autowired
    public UserDataController(UserTaskRepository userTaskRepository, UserTagRepository userTagRepository, UserWorkItemRepository userWorkItemRepository) {
        this.userTaskRepository = userTaskRepository;
        this.userTagRepository = userTagRepository;
        this.userWorkItemRepository = userWorkItemRepository;
    }

    @Transactional
    @DeleteMapping(("/removeAllUserData"))
    public void removeAllUserData(@AuthenticationPrincipal Jwt jwt) {
        String userClaim = jwt.getClaim("sub");

        List<Task> userTasks = userTaskRepository.findByUserID(userClaim);
        for (Task task : userTasks) {
            task.getTags().clear();
        }
        userTaskRepository.saveAll(userTasks);

        userTaskRepository.deleteByUserID(userClaim);
        userTagRepository.deleteByUserID(userClaim);
        userWorkItemRepository.deleteByUserID(userClaim);
    }
}
