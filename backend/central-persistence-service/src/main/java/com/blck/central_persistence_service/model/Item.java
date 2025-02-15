package com.blck.central_persistence_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user")
public record Item(
	@Id String itemID,
	String data
)
{}
