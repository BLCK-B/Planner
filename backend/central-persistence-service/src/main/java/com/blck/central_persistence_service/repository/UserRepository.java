package com.blck.central_persistence_service.repository;

import com.blck.central_persistence_service.model.UserItems;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Mono;

public interface UserRepository extends ReactiveMongoRepository<UserItems, String> {
	Mono<UserItems> findByUserID(String userID);
//	Mono<UserItems> save(UserItems userItems);
}