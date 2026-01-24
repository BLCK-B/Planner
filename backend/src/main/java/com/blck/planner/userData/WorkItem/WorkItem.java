package com.blck.planner.userData.WorkItem;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "user_workitems")
public class WorkItem {

    @Id
    @GeneratedValue(generator = "UUID")
    @Column(name = "item_id")
    @JsonProperty("itemID")
    private UUID itemID;

    @Column(name = "user_id")
    private String userID;

    @Column(name = "name")
    private String name;

    @Column(name = "subtasks", columnDefinition = "TEXT")
    @Convert(converter = SubtaskListConverter.class)
    private List<Subtask> subtasks;

    public WorkItem() {}

    public WorkItem(UUID itemID, String userID, String name, List<Subtask> subtasks) {
        this.itemID = itemID;
        this.userID = userID;
        this.name = name;
        this.subtasks = subtasks;
    }

    public WorkItemDTO toDTO() {
        var data = new WorkItemDTO.Data(name, subtasks);
        return new WorkItemDTO(itemID, data);
    }

    public UUID getItemID() {
        return itemID;
    }

    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Subtask> getSubtasks() {
        return subtasks;
    }

    public void setSubtasks(List<Subtask> subtasks) {
        this.subtasks = subtasks;
    }
}