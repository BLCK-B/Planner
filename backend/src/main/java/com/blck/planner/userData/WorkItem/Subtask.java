package com.blck.planner.userData.WorkItem;

public record Subtask(
   Data data
) {
    public record Data(
            String name,
            boolean completed
    ) { }
}
