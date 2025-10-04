package com.blck.planner.accounts;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface AccountRepository extends ReactiveCrudRepository<UserAccount, String> {
	Mono<UserAccount> findByUsername(String username);
}
