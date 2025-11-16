package com.blck.planner.userData;

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

    @Autowired
    public TagController(UserTagRepository userTagRepository) {
        this.userTagRepository = userTagRepository;
    }

    @GetMapping(value = "/userTags")
    public List<TagDTO> getTags(@AuthenticationPrincipal Jwt jwt) {
        return userTagRepository.findByUserID(jwt.getSubject()).stream()
                .map(Tag::toDTO)
                .toList();
    }

    @PutMapping(value = "/userTag")
    public TagDTO setTag(@AuthenticationPrincipal Jwt jwt, @RequestBody TagDTO userTag) {
        TagDTO dto = new TagDTO(userTag.tagID(), userTag.data());
        return userTagRepository.save(dto.toTag(jwt.getSubject())).toDTO();
    }

    @DeleteMapping(value = "/userTag/{tagID}")
    public String deleteTag(@AuthenticationPrincipal Jwt jwt, @PathVariable String tagID) {
        userTagRepository.deleteByUserIDAndTagID(jwt.getSubject(), UUID.fromString(tagID));
        return("User tag removed successfully.");
    }

    @PutMapping(value = "/updateAllUserTags")
    @Transactional
    public ResponseEntity<String> setTags(@AuthenticationPrincipal Jwt jwt, @RequestBody List<TagDTO> userTags) {
        String userID = jwt.getSubject();
        try {
            List<Tag> savedTags = userTagRepository.saveAll(userTags.stream()
                    .map(dto -> dto.toTag(userID))
                    .toList());
            return ResponseEntity.ok("Successfully updated " + savedTags.size() + " tags");
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update tags");
        }
    }

}
