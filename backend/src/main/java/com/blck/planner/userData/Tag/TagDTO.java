package com.blck.planner.userData.Tag;

import java.util.UUID;

public record TagDTO(
        UUID tagID,
        Data data
) {
    public record Data(
            String tagName,
            String color,
            boolean isTracked,
            String description
    ) {
    }

    public Tag toTag(String userID) {
        return new Tag(
                tagID,
                userID,
                data.tagName,
                data.color,
                data.isTracked,
                data.description
        );
    }
}