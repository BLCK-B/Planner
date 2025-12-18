package com.blck.planner.userData.Plan;

import com.blck.planner.userData.Task.Task;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "user_plans")
public class Plan {

    @Id
    @GeneratedValue(generator = "UUID")
    @Column(name = "plan_id")
    @JsonProperty("planID")
    private UUID planID;

    @Column(name = "user_id")
    private String userID;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "color")
    private String color;

    @Column(name = "completed")
    private String completed;

    @OneToMany(mappedBy = "plan")
    private Set<Task> tasks;

    public Plan() {}

    public Plan(UUID planID, String userID, String name, String description, String color, String completed) {
        this.planID = planID;
        this.userID = userID;
        this.name = name;
        this.description = description;
        this.color = color;
        this.completed = completed;
    }

    public PlanDTO toDTO() {
        var data = new PlanDTO.Data(name, description, color, completed);
        return new PlanDTO(planID, data);
    }

    public UUID getPlanID() {
        return planID;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getCompleted() {
        return completed;
    }

    public void setCompleted(String completed) {
        this.completed = completed;
    }
}