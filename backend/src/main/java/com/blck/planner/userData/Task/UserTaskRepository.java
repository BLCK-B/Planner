package com.blck.planner.userData.Task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserTaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByUserID(String userId);

    Optional<Task> findByUserIDAndItemID(String userId, UUID itemId);

    void deleteByUserIDAndItemID(String userId, UUID itemId);

    @Query("""
        SELECT t
        FROM Task t
        JOIN t.tags tag
        WHERE t.userID = :userId AND tag.tagID = :tagId
    """)
    List<Task> getAllUserTasksWithTag(String userId, UUID tagId);
}