package com.blck.planner.userData.Task;

import com.blck.planner.userData.Plan.PlanDTO;
import com.blck.planner.userData.Tag.Tag;
import com.blck.planner.userData.Tag.TagDTO;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record TaskDTO(
        UUID itemID,
        Data data
) {
    public record Data(
            String name,
            String date,
            String completed,
            String repeatEvent,
            int repeatOriginDay,
            boolean important,
            Set<TagDTO> tags,
            PlanDTO plan
    ) {
    }

    public Task toTask(String userID) {
        Set<Tag> tags = data.tags.stream()
                .map(t -> t.toTag(userID))
                .collect(Collectors.toSet());
        return new Task(
                itemID,
                userID,
                data.name,
                data.date,
                data.completed,
                data.repeatEvent,
                data.repeatOriginDay,
                data.important,
                tags,
                data.plan != null ? data.plan.toPlan(userID) : null
        );
    }
}

