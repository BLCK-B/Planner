package com.blck.planner.userData.Task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@PreAuthorize("hasRole('ROLE_USER')")
public class TaskController {

    private final UserTaskRepository userTaskRepository;

    @Autowired
    public TaskController(UserTaskRepository userTaskRepository) {
        this.userTaskRepository = userTaskRepository;
    }

    @GetMapping(value = "/userAccountInfo")
    public String getUserAccountInfo(@AuthenticationPrincipal Jwt jwt) {
        return jwt.getSubject();
    }

    // pagination in future
    @GetMapping("/userTasks")
    public List<TaskDTO> getTasks(@AuthenticationPrincipal Jwt jwt) {
        return userTaskRepository.findByUserID(jwt.getSubject()).stream()
                .map(Task::toDTO)
                .toList();
    }

    @GetMapping("/allUserTasks")
    public List<TaskDTO> getAllTasks(@AuthenticationPrincipal Jwt jwt) {
        return userTaskRepository.findByUserID(jwt.getSubject()).stream()
                .map(Task::toDTO)
                .toList();
    }

    @PutMapping("/userTask")
    public TaskDTO setTask(@AuthenticationPrincipal Jwt jwt, @RequestBody TaskDTO userItem) {
        TaskDTO dto = new TaskDTO(userItem.itemID(), userItem.data());
        return userTaskRepository.save(dto.toTask(jwt.getSubject())).toDTO();
    }

    @Transactional
    @DeleteMapping("/userTask/{taskID}")
    public String deleteTask(@AuthenticationPrincipal Jwt jwt, @PathVariable String taskID) {
        userTaskRepository.deleteByUserIDAndItemID(jwt.getSubject(), UUID.fromString(taskID));
        return "User task removed successfully.";
    }

    @Transactional
    @PutMapping("/updateAllUserTasks")
    public ResponseEntity<String> setTasks(@AuthenticationPrincipal Jwt jwt, @RequestBody List<TaskDTO> userItems) {
        String userID = jwt.getSubject();
        try {
            List<Task> savedTasks = userTaskRepository.saveAll(userItems.stream()
                    .map(dto -> dto.toTask(userID))
                    .toList());
            return ResponseEntity.ok("Successfully updated " + savedTasks.size() + " tasks");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update tasks");
        }
    }
}
