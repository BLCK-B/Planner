package com.blck.planner.userData;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.util.UUID;

@Table("user_tasks")
public record Task(
        @Id
        @JsonProperty("itemID")
        UUID itemID,
        String userID,
        String itemType,
        String name,
        String date,
        String tags,
        String completed,
        String repeatEvent,
        int repeatOriginDay,
        String planID
) {
    public TaskDTO toDTO() {
        var data = new TaskDTO.Data(itemType, name, date, tags, completed, repeatEvent, repeatOriginDay, planID);
        return new TaskDTO(itemID, data);
    }
}