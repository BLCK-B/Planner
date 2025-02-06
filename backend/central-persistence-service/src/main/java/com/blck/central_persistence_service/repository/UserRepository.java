package com.blck.central_persistence_service.repository;

import com.blck.central_persistence_service.model.UserItems;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface UserRepository extends ReactiveMongoRepository<UserItems, String> {
//	Flux<User> findByNameContains(String name);
}