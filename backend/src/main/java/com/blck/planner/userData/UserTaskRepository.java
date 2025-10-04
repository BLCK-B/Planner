package com.blck.planner.userData;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserTaskRepository extends ReactiveCrudRepository<Task, String> {
    Flux<Task> findByUserID(String userId);

    Mono<Task> findByUserIDAndItemID(String userId, String itemId);

    Mono<Void> deleteByUserIDAndItemID(String userId, String itemId);
}