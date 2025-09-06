package com.blck.planner.userData;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/users")
@PreAuthorize("hasRole('ROLE_USER')")
public class PlanController {

    private final UserPlanRepository userPlanRepository;

    private final ReactiveMongoTemplate mongoTemplate;

    @Autowired
    public PlanController(UserPlanRepository userPlanRepository, ReactiveMongoTemplate mongoTemplate) {
        this.userPlanRepository = userPlanRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping(value = "/userPlans", produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<Plan> getPlans(@AuthenticationPrincipal Jwt jwt) {
        return userPlanRepository.findByUserID(jwt.getSubject());
    }

    @PutMapping(value = "/userPlan", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Plan> setPlan(@AuthenticationPrincipal Jwt jwt, @RequestBody JsonNode userItem) {
        String itemID = userItem.get("itemID").asText();
        if (itemID == null || itemID.isBlank()) {
            itemID = null;
        }
        Plan plan = new Plan(itemID, jwt.getSubject(), userItem.get("data").toString());
        return mongoTemplate.save(plan);
    }

    @DeleteMapping(value = "/userPlan/{planID}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> deletePlan(@AuthenticationPrincipal Jwt jwt, @PathVariable String planID) {
        return userPlanRepository.deleteByUserIDAndItemID(jwt.getSubject(), planID)
                .thenReturn("User task removed successfully.");
    }
}
