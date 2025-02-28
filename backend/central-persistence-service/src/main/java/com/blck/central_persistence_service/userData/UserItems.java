package com.blck.central_persistence_service.userData;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
// to be replaced
@Document(collection = "user")
public record UserItems(
		@Id String userID,
		List<String> items
) {}


