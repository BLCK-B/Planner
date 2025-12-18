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

    @Column(name = "important")
    private boolean important;

    @ManyToMany
    @JoinTable(
            name = "user_task_tag",
            joinColumns = @JoinColumn(name = "item_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private Plan plan;

    public Task() {}

    public Task(UUID itemID, String userID, String name, String date, String completed,
                String repeatEvent, int repeatOriginDay, boolean important, Set<Tag> tags, Plan plan) {
        this.itemID = itemID;
        this.userID = userID;
        this.name = name;
        this.date = date;
        this.completed = completed;
        this.repeatEvent = repeatEvent;
        this.repeatOriginDay = repeatOriginDay;
        this.tags = tags;
        this.plan = plan;
        this.important = important;
    }

    public TaskDTO toDTO() {
        var tagDtos = tags.stream()
                .map(Tag::toDTO)
                .collect(Collectors.toSet());
        var planDto = (plan != null) ? plan.toDTO() : null;
        var data = new TaskDTO.Data(name, date, completed, repeatEvent, repeatOriginDay, important, tagDtos, planDto);
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

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public Plan getPlan() {
        return plan;
    }

    public void setPlan(Plan plan) {
        this.plan = plan;
    }
}