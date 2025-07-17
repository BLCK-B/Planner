package com.blck.central_persistence_service.userData;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userTasks")
public record Task(
		@Id String itemID,
		String userID,
		String data
) {}
