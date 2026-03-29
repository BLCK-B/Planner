package com.blck.planner.userData.Initiative;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InitiativeRepository extends JpaRepository<Initiative, UUID> {
    List<Initiative> findByUserID(String userId);

    Initiative findByUserIDAndItemID(String userId, UUID itemID);

    void deleteByUserIDAndItemID(String userId, UUID itemID);
}
