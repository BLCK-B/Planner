package com.blck.planner.userData.Initiative;

public record InitiativeRecord(
        Data data
) {
    public record Data(
            String recordID,
            String comment,
            int rating,
            String date
    ) {
    }
}
