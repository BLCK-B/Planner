package com.blck.planner.userData.Tag;

import com.blck.planner.userData.Task.Task;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "user_tags")
public class Tag {

    @Id
    @GeneratedValue(generator = "UUID")
    @Column(name = "tag_id")
    @JsonProperty("tagID")
    private UUID tagID;

    @Column(name = "user_id")
    private String userID;

    @Column(name = "tag_name")
    private String tagName;

    @Column(name = "color")
    private String color;

    @ManyToMany(mappedBy = "tags")
    private Set<Task> tasks;

    public Tag() {
    }

    public Tag(UUID tagID, String userID, String tagName, String color) {
        this.tagID = tagID;
        this.userID = userID;
        this.tagName = tagName;
        this.color = color;
    }

    public TagDTO toDTO() {
        var data = new TagDTO.Data(tagName, color);
        return new TagDTO(tagID, data);
    }

    public UUID getTagID() {
        return tagID;
    }

    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Set<Task> getTasks() {
        return tasks;
    }

    public void setTasks(Set<Task> tasks) {
        this.tasks = tasks;
    }
}