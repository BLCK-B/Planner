package com.blck.planner.userData.Plan;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserPlanRepository extends JpaRepository<Plan, UUID> {
    List<Plan> findByUserID(String userId);

    Plan findByUserIDAndItemID(String userId, UUID itemId);

    Plan deleteByUserIDAndItemID(String userId, UUID itemId);
}
