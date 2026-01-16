package com.blck.planner.userData.WorkItem;

import java.util.Set;
import java.util.UUID;

public record WorkItemDTO(
        UUID itemID,
        Data data
) {
    public record Data(
            String name,
            Set<Subtask> subtasks
    ) { }

    public WorkItem toWorkItem(String userID) {
        return new WorkItem(
                itemID,
                userID,
                data.name,
                data.subtasks
        );
    }
}

