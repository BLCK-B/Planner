import type {Task} from "@/types/Task.ts";
import {newTask} from "@/types/Task.ts";

export const enforceTask = (task: Partial<Task>): Task => {
    if (!task || !task.itemID || !task.data) {
        throw new Error("illegal structure");
    }
    const newLocalTask: Task = JSON.parse(JSON.stringify(newTask));
    (newLocalTask.itemID as any) = (task.itemID as any);
    for (const key in task.data) {
        if (key in newLocalTask.data) {
            (newLocalTask.data as any)[key] = (task.data as any)[key];
        }
    }

    return newLocalTask;
};