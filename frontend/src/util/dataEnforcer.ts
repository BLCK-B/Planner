import type {Task} from "@/types/Task.ts";
import type {Plan} from "@/types/Plan.ts";
import {newTask} from "@/types/Task.ts";
import {newPlan} from "@/types/Plan.ts";

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

export const enforcePlan = (plan: Partial<Plan>): Plan => {
    if (!plan || !plan.itemID || !plan.data) {
        throw new Error("illegal structure");
    }
    const newLocalPlan: Plan = JSON.parse(JSON.stringify(newPlan));
    (newLocalPlan.itemID as any) = (plan.itemID as any);
    for (const key in plan.data) {
        if (key in newLocalPlan.data) {
            (newLocalPlan.data as any)[key] = (plan.data as any)[key];
        }
    }

    return newLocalPlan;
};