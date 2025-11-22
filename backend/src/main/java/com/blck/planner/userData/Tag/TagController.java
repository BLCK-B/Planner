package com.blck.planner.userData.Tag;

import com.blck.planner.userData.Task.Task;
import com.blck.planner.userData.Task.UserTaskRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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
public class TagController {

    private final UserTagRepository userTagRepository;

    private final UserTaskRepository userTaskRepository;

    @PersistenceContext
    private EntityManager em;

    @Autowired
    public TagController(UserTagRepository userTagRepository, UserTaskRepository userTaskRepository) {
        this.userTagRepository = userTagRepository;
        this.userTaskRepository = userTaskRepository;
    }

    @GetMapping(value = "/userTags")
    public List<TagDTO> getTags(@AuthenticationPrincipal Jwt jwt) {
        return userTagRepository.findByUserID(jwt.getSubject()).stream()
                .map(Tag::toDTO)
                .toList();
    }

    @PutMapping(value = "/userTag")
    public TagDTO setTag(@AuthenticationPrincipal Jwt jwt, @RequestBody TagDTO userTag) {
        return userTagRepository.save(userTag.toTag(jwt.getSubject())).toDTO();
    }

    @Transactional
    @DeleteMapping(value = "/userTag/{tagID}")
    public String deleteTag(@AuthenticationPrincipal Jwt jwt, @PathVariable String tagID) {
        em.createNativeQuery("DELETE FROM user_task_tag WHERE tag_id = ?1")
                .setParameter(1, UUID.fromString(tagID))
                .executeUpdate();

        userTagRepository.deleteByUserIDAndTagID(jwt.getSubject(), UUID.fromString(tagID));
        return ("User tag removed successfully.");
    }

    @Transactional
    @PutMapping(value = "/updateAllUserTags")
    public ResponseEntity<String> setTags(@AuthenticationPrincipal Jwt jwt, @RequestBody List<TagDTO> userTags) {
        String userID = jwt.getSubject();
        try {
            List<Tag> savedTags = userTagRepository.saveAll(userTags.stream()
                    .map(dto -> dto.toTag(userID))
                    .toList());
            return ResponseEntity.ok("Successfully updated " + savedTags.size() + " tags");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update tags");
        }
    }

}
