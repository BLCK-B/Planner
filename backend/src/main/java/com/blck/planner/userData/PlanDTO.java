package com.blck.planner.userData;

import java.util.UUID;

public record PlanDTO(
        UUID itemID,
        String userID,
        Data data
) {
    public record Data(
            String name,
            String description,
            String color,
            String completed
    ) {
    }

    public Plan toPlan() {
        return new Plan(
                itemID,
                userID,
                data.name,
                data.description,
                data.color,
                data.completed
        );
    }
}