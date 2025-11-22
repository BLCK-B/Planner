package com.blck.planner.userData.Plan;

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
public class PlanController {

    private final UserPlanRepository userPlanRepository;

    @Autowired
    public PlanController(UserPlanRepository userPlanRepository) {
        this.userPlanRepository = userPlanRepository;
    }

    @GetMapping(value = "/userPlans")
    public List<PlanDTO> getPlans(@AuthenticationPrincipal Jwt jwt) {
        return userPlanRepository.findByUserID(jwt.getSubject()).stream()
                .map(Plan::toDTO)
                .toList();
    }

    @PutMapping(value = "/userPlan")
    public PlanDTO setPlan(@AuthenticationPrincipal Jwt jwt, @RequestBody PlanDTO userItem) {
        PlanDTO dto = new PlanDTO(userItem.planID(), userItem.data());
        return userPlanRepository.save(dto.toPlan(jwt.getSubject())).toDTO();
    }

    @DeleteMapping(value = "/userPlan/{planID}")
    public String deletePlan(@AuthenticationPrincipal Jwt jwt, @PathVariable String planID) {
        userPlanRepository.deleteByUserIDAndPlanID(jwt.getSubject(), UUID.fromString(planID));
        return("User plan removed successfully.");
    }

    @PutMapping(value = "/updateAllUserPlans")
    @Transactional
    public ResponseEntity<String> setPlans(@AuthenticationPrincipal Jwt jwt, @RequestBody List<PlanDTO> userItems) {
        String userID = jwt.getSubject();
        try {
            List<Plan> savedPlans = userPlanRepository.saveAll(userItems.stream()
                    .map(dto -> dto.toPlan(userID))
                    .toList());
            return ResponseEntity.ok("Successfully updated " + savedPlans.size() + " plans");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update plans");
        }
    }
}
