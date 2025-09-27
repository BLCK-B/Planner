package com.blck.planner.userData;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.util.List;

@Table("user_tasks")
public record Task(
		@Id
		@JsonProperty("itemID")
		String itemID,
		String userID,
		Data data
) {
	public record Data(
			String itemType,
			String name,
			String date,
			List<String> tags,
			String completed,
			String repeatEvent,
			int repeatOriginDay,
			String planID
	) {}
}