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

    /** Returns all tasks without <code>completed</code>. This includes <code>someday</code>. */
    @Query("""
        SELECT t FROM Task t
        WHERE t.userID = :userId
        AND (t.completed IS NULL OR t.completed = '')
        ORDER BY t.date ASC
    """)
    List<Task> getUncompletedUserTasks(String userId);

    /** Returns paginated tasks with not null <code>completed</code>. */
    @Query("""
        SELECT t FROM Task t
        WHERE t.userID = :userId
        AND (t.completed IS NOT NULL AND t.completed != '')
        ORDER BY t.completed DESC
        LIMIT :size OFFSET :offset
    """)
    List<Task> getCompletedUserTasksBetween(String userId, int offset, int size);

    /** Returns all tasks that have at least one assigned tag. */
    @Query("""
        SELECT t
        FROM Task t
        JOIN t.tags tag
        WHERE t.userID = :userId AND tag.tagID = :tagId
    """)
    List<Task> getAllUserTasksWithTag(String userId, UUID tagId);
}