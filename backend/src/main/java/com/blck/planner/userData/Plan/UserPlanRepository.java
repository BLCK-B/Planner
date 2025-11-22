package com.blck.planner.userData.Plan;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserPlanRepository extends JpaRepository<Plan, UUID> {
    List<Plan> findByUserID(String userId);

    Plan findByUserIDAndPlanID(String userId, UUID planId);

    Plan deleteByUserIDAndPlanID(String userId, UUID planId);
}
