package com.blck.planner.userData;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userPlans")
public record Plan (
        @Id @JsonProperty("itemID") String itemID,
        String userID,
        String data
) {}
