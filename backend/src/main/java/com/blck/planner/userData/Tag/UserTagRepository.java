package com.blck.planner.userData.Tag;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserTagRepository extends JpaRepository<Tag, UUID> {
    List<Tag> findByUserID(String userId);

    Tag deleteByUserIDAndTagID(String userId, UUID itemId);
}
