package com.blck.central_persistence_service.userData;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserItemRepository extends ReactiveMongoRepository<Task, String> {
    Flux<Task> findByUserID(String userId);

    Mono<Void> deleteByUserIDAndItemID(String userId, String itemId);
}