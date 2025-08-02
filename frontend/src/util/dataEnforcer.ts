import type {Task} from "@/types/Task.ts";

export const enforceTask = (task: Partial<Task>): Task => {
    const standard: Task = {
        itemID: '',
        data: {
            name: '',
            date: '',
            deadline: true,
            tags: [],
            completed: ''
        },
    };

    if (!task || !task.itemID || !task.data) {
        throw new Error("illegal structure");
    }
    (standard.itemID as any) = (task.itemID as any);
    for (const key in task.data) {
        if (key in standard.data) {
            (standard.data as any)[key] = (task.data as any)[key];
        }
    }

    return standard;
};