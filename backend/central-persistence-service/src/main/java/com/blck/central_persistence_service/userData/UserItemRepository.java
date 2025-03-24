package com.blck.central_persistence_service.userData;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface UserItemRepository extends ReactiveMongoRepository<UserItem, String> {

}