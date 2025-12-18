package com.blck.planner.userData.Plan;

import java.util.UUID;

public record PlanDTO(
        UUID planID,
        Data data
) {
    public record Data(
            String name,
            String description,
            String color,
            String completed
    ) {
    }

    public Plan toPlan(String userID) {
        return new Plan(
                planID,
                userID,
                data.name,
                data.description,
                data.color,
                data.completed
        );
    }
}