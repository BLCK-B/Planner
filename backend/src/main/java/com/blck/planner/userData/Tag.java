package com.blck.planner.userData;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

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

    public void setTagID(UUID tagID) {
        this.tagID = tagID;
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
}