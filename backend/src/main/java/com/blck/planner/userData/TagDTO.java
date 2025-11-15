package com.blck.planner.userData;

import java.util.UUID;

public record TagDTO(
        UUID tagID,
        Data data
) {
    public record Data(
            String tagName,
            String color
    ) {
    }

    public Tag toTag(String userID) {
        return new Tag(
                tagID,
                userID,
                data.tagName,
                data.color
        );
    }
}