import FetchRequest from "@/functions/FetchRequest.tsx";
import type {TaskType} from "@/types/TaskType.ts";
import {createStore} from "jotai";
import {isDemoMode} from "@/global/atoms.ts";
import {scramble} from "@/functions/Crypto.ts";

export const store = createStore();

const fetchItems = async (): Promise<TaskType[]> => {
    if (!store.get(isDemoMode)) {
        return await FetchRequest("GET", "/users/userTasks");
    }
    const tasks: TaskType[] = await FetchRequest("GET", "/users/userTasks");
    return tasks.map(task => ({
        ...task,
        data: {
            ...task.data,
            name: scramble(task.data.name),
        },
    }));
};

export const loadItemsQuery = () => ({
    queryKey: ['userItems'],
    queryFn: fetchItems,
});

export default loadItemsQuery;