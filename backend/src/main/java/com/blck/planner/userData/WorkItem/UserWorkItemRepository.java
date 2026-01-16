package com.blck.planner.userData.WorkItem;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserWorkItemRepository extends JpaRepository<WorkItem, UUID> {
    List<WorkItem> findByUserID(String userId);

    Optional<WorkItem> findByUserIDAndItemID(String userId, UUID itemId);

    void deleteByUserIDAndItemID(String userId, UUID itemId);
}