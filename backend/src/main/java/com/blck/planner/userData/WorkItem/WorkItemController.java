package com.blck.planner.userData.WorkItem;

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
public class WorkItemController {

    private final UserWorkItemRepository userWorkItemRepository;

    @Autowired
    public WorkItemController(UserWorkItemRepository userWorkItemRepository) {
        this.userWorkItemRepository = userWorkItemRepository;
    }

    @GetMapping("/userWorkItems")
    public List<WorkItemDTO> getWorkItems(@AuthenticationPrincipal Jwt jwt) {
        return userWorkItemRepository.findByUserID(jwt.getSubject()).stream()
                .map(WorkItem::toDTO)
                .toList();
    }

    @GetMapping("/userWorkItem/{workItemId}")
    public WorkItemDTO getWorkItem(@AuthenticationPrincipal Jwt jwt, @PathVariable String workItemId) {
        return userWorkItemRepository.findByUserIDAndItemID(jwt.getSubject(), UUID.fromString(workItemId)).toDTO();
    }

    @PutMapping("/userWorkItem")
    public WorkItemDTO setWorkItem(@AuthenticationPrincipal Jwt jwt, @RequestBody WorkItemDTO userItem) {
        WorkItemDTO dto = new WorkItemDTO(userItem.itemID(), userItem.data());
        return userWorkItemRepository.save(dto.toWorkItem(jwt.getSubject())).toDTO();
    }

    @Transactional
    @DeleteMapping("/userWorkItem/{workItemID}")
    public String deleteWorkItem(@AuthenticationPrincipal Jwt jwt, @PathVariable String workItemID) {
        userWorkItemRepository.deleteByUserIDAndItemID(jwt.getSubject(), UUID.fromString(workItemID));
        return "User work item removed successfully.";
    }

    @Transactional
    @PutMapping("/updateAllUserWorkItems")
    public ResponseEntity<String> setWorkItems(@AuthenticationPrincipal Jwt jwt, @RequestBody List<WorkItemDTO> userItems) {
        String userID = jwt.getSubject();
        try {
            List<WorkItem> savedWorkItems = userWorkItemRepository.saveAll(userItems.stream()
                    .map(dto -> dto.toWorkItem(userID))
                    .toList());
            return ResponseEntity.ok("Successfully updated " + savedWorkItems.size() + " work items");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update work items");
        }
    }
}
