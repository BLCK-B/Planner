import FetchRequest from "@/functions/FetchRequest.tsx";
import type {TaskType} from "@/types/TaskType.ts";
import {isDemoMode} from "@/global/atoms.ts";
import {scramble} from "@/functions/Crypto.ts";
import {createStore} from "jotai";

export const store = createStore();

const fetchTasks = async (): Promise<TaskType[]> => {
    if (!store.get(isDemoMode)) {
        return await FetchRequest("GET", "/users/userTasksAssignedToPlans");
    }
    const tasks: TaskType[] = await FetchRequest("GET", "/users/userTasksAssignedToPlans");
    return tasks.map(task => ({
        ...task,
        data: {
            ...task.data,
            name: scramble(task.data.name),
        },
    }));
};

export const loadTasksAssignedToPlansQuery = () => ({
    queryKey: ['userTasksAssignedToPlans'],
    queryFn: fetchTasks,
});

export default loadTasksAssignedToPlansQuery;