package com.blck.planner.userData.Task;

import com.blck.planner.userData.Plan.Plan;
import com.blck.planner.userData.Tag.Tag;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(name = "user_tasks")
public class Task {

    @Id
    @GeneratedValue(generator = "UUID")
    @Column(name = "item_id")
    @JsonProperty("itemID")
    private UUID itemID;

    @Column(name = "user_id")
    private String userID;

    @Column(name = "item_type")
    private String itemType;

    @Column(name = "name")
    private String name;

    @Column(name = "date")
    private String date;

    @Column(name = "completed")
    private String completed;

    @Column(name = "repeat_event")
    private String repeatEvent;

    @Column(name = "repeat_origin_day")
    private int repeatOriginDay;

    @ManyToMany
    @JoinTable(
            name = "user_task_tag",
            joinColumns = @JoinColumn(name = "item_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags;

    @ManyToMany(mappedBy = "tasks")
    private Set<Plan> plans;

    @Column(name = "plan_id")
    private String planID;

    public Task() {}

    public Task(UUID itemID, String userID, String itemType, String name, String date,
                String completed, String repeatEvent, int repeatOriginDay, Set<Tag> tags, String planID) {
        this.itemID = itemID;
        this.userID = userID;
        this.itemType = itemType;
        this.name = name;
        this.date = date;
        this.completed = completed;
        this.repeatEvent = repeatEvent;
        this.repeatOriginDay = repeatOriginDay;
        this.tags = tags;
        this.planID = planID;
    }

    public TaskDTO toDTO() {
        var tagDtos = tags.stream()
                .map(Tag::toDTO)
                .collect(Collectors.toSet());
        var data = new TaskDTO.Data(itemType, name, date, completed, repeatEvent, repeatOriginDay, tagDtos, planID);
        return new TaskDTO(itemID, data);
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

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getCompleted() {
        return completed;
    }

    public void setCompleted(String completed) {
        this.completed = completed;
    }

    public String getRepeatEvent() {
        return repeatEvent;
    }

    public void setRepeatEvent(String repeatEvent) {
        this.repeatEvent = repeatEvent;
    }

    public int getRepeatOriginDay() {
        return repeatOriginDay;
    }

    public void setRepeatOriginDay(int repeatOriginDay) {
        this.repeatOriginDay = repeatOriginDay;
    }

    public String getPlanID() {
        return planID;
    }

    public void setPlanID(String planID) {
        this.planID = planID;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }
}