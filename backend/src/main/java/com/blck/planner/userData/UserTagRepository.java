package com.blck.planner.userData;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserTagRepository extends ReactiveCrudRepository<Tag, String> {
    Flux<Tag> findByUserID(String userId);

    Mono<Tag> deleteByUserIDAndTagID(String userId, String itemId);
}
