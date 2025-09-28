package com.blck.planner.userData;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("user_plans")
public record Plan (
        @Id
        @JsonProperty("itemID") String itemID,
        String userID,
        String data
) {}