package com.blck.planner.userData.Plan;

import com.blck.planner.userData.Task.Task;
import com.blck.planner.userData.Task.TaskDTO;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record PlanDTO(
        UUID planID,
        Data data
) {
    public record Data(
            String name,
            String description,
            String color,
            String completed,
            Set<TaskDTO> tasks
    ) {
    }

    public Plan toPlan(String userID) {
        Set<Task> tasks = data.tasks.stream()
                .map(t -> t.toTask(userID))
                .collect(Collectors.toSet());
        return new Plan(
                planID,
                userID,
                data.name,
                data.description,
                data.color,
                data.completed,
                tasks
        );
    }
}