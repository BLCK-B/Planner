package com.blck.central_persistence_service.accounts;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Mono;

public interface AccountRepository extends ReactiveMongoRepository<UserAccount, String> {
	Mono<UserAccount> findByUsername(String username);
}
