package com.blck.central_persistence_service.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "users")
public record UserItems(
		@Id String userID,
		List<String> items
) {}


