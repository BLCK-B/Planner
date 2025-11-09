package com.blck.planner.userData;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("user_plans")
public record Plan(
        @Id
        @JsonProperty("itemID")
        UUID itemID,
        String userID,
        String name,
        String description,
        String color,
        String completed
) {
    public PlanDTO toDTO() {
        var data = new PlanDTO.Data(name, description, color, completed);
        return new PlanDTO(itemID, data);
    }
}