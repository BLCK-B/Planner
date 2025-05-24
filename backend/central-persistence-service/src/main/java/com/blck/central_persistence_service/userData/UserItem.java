package com.blck.central_persistence_service.userData;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "thisistest")
public record UserItem(
	@Id String itemID,
	String data
)
{}
