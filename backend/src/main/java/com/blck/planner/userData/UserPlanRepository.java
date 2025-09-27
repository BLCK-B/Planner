package com.blck.planner.userData;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserPlanRepository extends ReactiveCrudRepository<Plan, String> {
    Flux<Plan> findByUserID(String userId);

    Mono<Plan> findByUserIDAndItemID(String userId, String itemId);

    Mono<Plan> deleteByUserIDAndItemID(String userId, String itemId);
}
