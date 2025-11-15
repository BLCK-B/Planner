package com.blck.planner.userData;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("user_tags")
public record Tag(
        @Id
        @JsonProperty("tagID")
        UUID tagID,
        String userID,
        String tagName,
        String color
) {
    public TagDTO toDTO() {
        var data = new TagDTO.Data(tagName, color);
        return new TagDTO(tagID, data);
    }
}