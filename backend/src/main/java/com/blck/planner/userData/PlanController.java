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
public class PlanController {

    private final UserPlanRepository userPlanRepository;

    @Autowired
    public PlanController(UserPlanRepository userPlanRepository) {
        this.userPlanRepository = userPlanRepository;
    }

    @GetMapping(value = "/userPlans")
    public Flux<PlanDTO> getPlans(@AuthenticationPrincipal Jwt jwt) {
        return userPlanRepository.findByUserID(jwt.getSubject()).map(Plan::toDTO);
    }

    @PutMapping(value = "/userPlan")
    public Mono<PlanDTO> setPlan(@AuthenticationPrincipal Jwt jwt, @RequestBody PlanDTO userItem) {
        PlanDTO dto = new PlanDTO(userItem.itemID(), userItem.data());
        return userPlanRepository.save(dto.toPlan(jwt.getSubject())).map(Plan::toDTO);
    }

    @DeleteMapping(value = "/userPlan/{planID}")
    public Mono<String> deletePlan(@AuthenticationPrincipal Jwt jwt, @PathVariable String planID) {
        return userPlanRepository.deleteByUserIDAndItemID(jwt.getSubject(), planID)
                .thenReturn("User plan removed successfully.");
    }

    @PutMapping(value = "/updateAllUserPlans")
    @Transactional
    public Mono<ResponseEntity<String>> setPlans(@AuthenticationPrincipal Jwt jwt, @RequestBody List<PlanDTO> userItems) {
        List<PlanDTO> dtos = userItems.stream()
                .map(userItem -> new PlanDTO(userItem.itemID(), userItem.data()))
                .toList();
        String userID = jwt.getSubject();
        return userPlanRepository.saveAll(dtos.stream().map(dto -> dto.toPlan(userID)).collect(Collectors.toList()))
                .collectList()
                .map(savedPlans -> ResponseEntity.ok("Successfully updated " + savedPlans.size() + " plans"))
                .defaultIfEmpty(ResponseEntity.status(500).body("Failed to update plans"));
    }
}
