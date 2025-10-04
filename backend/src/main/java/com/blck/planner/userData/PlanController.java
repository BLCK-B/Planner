package com.blck.planner.userData;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@PreAuthorize("hasRole('ROLE_USER')")
public class PlanController {

    private final UserPlanRepository userPlanRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public PlanController(UserPlanRepository userPlanRepository) {
        this.userPlanRepository = userPlanRepository;
    }

    @GetMapping(value = "/userPlans")
    public Flux<PlanDTO> getPlans(@AuthenticationPrincipal Jwt jwt) {
        return userPlanRepository.findByUserID(jwt.getSubject()).map(Plan::toDTO);
    }

    @PutMapping(value = "/userPlan")
    public Mono<PlanDTO> setPlan(@AuthenticationPrincipal Jwt jwt, @RequestBody JsonNode userItem) {
        String itemIdString = userItem.get("itemID").asText(null);
        UUID itemID = null;
        if (itemIdString != null && !itemIdString.isBlank()) {
            itemID = UUID.fromString(itemIdString);
        }
        PlanDTO.Data data = objectMapper.convertValue(userItem.get("data"), PlanDTO.Data.class);
        PlanDTO dto = new PlanDTO(itemID, jwt.getSubject(), data);
        return userPlanRepository.save(dto.toPlan()).map(Plan::toDTO);
    }

    @DeleteMapping(value = "/userPlan/{planID}")
    public Mono<String> deletePlan(@AuthenticationPrincipal Jwt jwt, @PathVariable String planID) {
        return userPlanRepository.deleteByUserIDAndItemID(jwt.getSubject(), planID)
                .thenReturn("User task removed successfully.");
    }
}
