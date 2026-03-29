package com.blck.planner.userData.Tag;

import java.util.UUID;

public record TagDTO(
        UUID itemID,
        Data data
) {
    public record Data(
            String tagName,
            String color
    ) {
    }

    public Tag toTag(String userID) {
        return new Tag(
                itemID,
                userID,
                data.tagName,
                data.color
        );
    }
}