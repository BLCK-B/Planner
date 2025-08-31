package com.blck.planner.userData;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserItemRepository extends ReactiveMongoRepository<Task, String> {
    Flux<Task> findByUserID(String userId);

    Mono<Task> findByUserIDAndItemID(String userId, String itemId);

    Mono<Void> deleteByUserIDAndItemID(String userId, String itemId);
}