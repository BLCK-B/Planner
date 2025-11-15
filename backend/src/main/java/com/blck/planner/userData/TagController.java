package com.blck.planner.userData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

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
    public Flux<TagDTO> getTags(@AuthenticationPrincipal Jwt jwt) {
        return userTagRepository.findByUserID(jwt.getSubject()).map(Tag::toDTO);
    }

    @PutMapping(value = "/userTag")
    public Mono<TagDTO> setTag(@AuthenticationPrincipal Jwt jwt, @RequestBody TagDTO userTag) {
        TagDTO dto = new TagDTO(userTag.tagID(), userTag.data());
        return userTagRepository.save(dto.toTag(jwt.getSubject())).map(Tag::toDTO);
    }

    @DeleteMapping(value = "/userTag/{tagID}")
    public Mono<String> deleteTag(@AuthenticationPrincipal Jwt jwt, @PathVariable String tagID) {
        return userTagRepository.deleteByUserIDAndTagID(jwt.getSubject(), tagID)
                .thenReturn("User tag removed successfully.");
    }

    @PutMapping(value = "/updateAllUserTags")
    @Transactional
    public Mono<ResponseEntity<String>> setTags(@AuthenticationPrincipal Jwt jwt, @RequestBody List<TagDTO> userTags) {
        List<TagDTO> dtos = userTags.stream()
                .map(userItem -> new TagDTO(userItem.tagID(), userItem.data()))
                .toList();
        String userID = jwt.getSubject();
        return userTagRepository.saveAll(dtos.stream().map(dto -> dto.toTag(userID)).collect(Collectors.toList()))
                .collectList()
                .map(savedTags -> ResponseEntity.ok("Successfully updated " + savedTags.size() + " tags"))
                .defaultIfEmpty(ResponseEntity.status(500).body("Failed to update tags"));
    }

}
