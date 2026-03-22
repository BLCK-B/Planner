package com.blck.planner.userData.Initiative;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "user_initiatives")
public class Initiative {

    @Id
    @GeneratedValue(generator = "UUID")
    @Column(name = "item_id")
    @JsonProperty("itemID")
    private UUID itemID;

    @Column(name = "user_id")
    private String userID;

    @Column(name = "name")
    private String name;

    @Column(name = "records", columnDefinition = "TEXT")
    @Convert(converter = InitiativeListConverter.class)
    private List<InitiativeRecord> records;

    public Initiative() {
    }

    public Initiative(UUID itemID, String userID, String name, List<InitiativeRecord> records) {
        this.itemID = itemID;
        this.userID = userID;
        this.name = name;
        this.records = records;
    }

    public InitiativeDTO toDTO() {
        var data = new InitiativeDTO.Data(name, records);
        return new InitiativeDTO(itemID, data);
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

    public List<InitiativeRecord> getRecords() {
        return records;
    }

    public void setRecords(List<InitiativeRecord> records) {
        this.records = records;
    }
}