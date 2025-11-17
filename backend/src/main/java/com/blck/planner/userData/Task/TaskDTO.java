package com.blck.planner.userData.Task;

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
            String itemType,
            String name,
            String date,
            String completed,
            String repeatEvent,
            int repeatOriginDay,
            Set<TagDTO> tags,
            String planID
    ) {
    }

    public Task toTask(String userID) {
        Set<Tag> tags = data.tags.stream()
                .map(t -> t.toTag(userID))
                .collect(Collectors.toSet());
        return new Task(
                itemID,
                userID,
                data.itemType,
                data.name,
                data.date,
                data.completed,
                data.repeatEvent,
                data.repeatOriginDay,
                tags,
                data.planID
        );
    }
}

