package com.blck.planner.userData;

import java.util.List;
import java.util.UUID;

public record TaskDTO(
        UUID itemID,
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
    ) {
    }

    public Task toTask() {
        return new Task(
                itemID,
                userID,
                data.itemType,
                data.name,
                data.date,
                data.tags,
                data.completed,
                data.repeatEvent,
                data.repeatOriginDay,
                data.planID
        );
    }
}

