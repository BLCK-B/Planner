package com.blck.central_persistence_service.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Map;

@Document(collection = "users")
public record User(
		@Id String id,
		String name,
		Map<String, Object> attributes
) {}


