package com.blck.planner.userData.Initiative;

import java.util.List;
import java.util.UUID;

public record InitiativeDTO(
        UUID itemID,
        Data data
) {
    public record Data(
            String name,
            int remindDays,
            List<InitiativeRecord> records
    ) {
    }

    public Initiative toInitiative(String userID) {
        return new Initiative(
                itemID,
                userID,
                data.name,
                data.remindDays,
                data.records
        );
    }
}

