import FetchRequest from "@/functions/FetchRequest.tsx";
import type {TaskType} from "@/types/TaskType.ts";
import {createStore} from "jotai";
import {isDemoMode} from "@/global/atoms.ts";
import {scramble} from "@/functions/Crypto.ts";

export const store = createStore();

const fetchUncompleted = async (): Promise<TaskType[]> => {
    if (!store.get(isDemoMode)) {
        return await FetchRequest("GET", "/users/uncompleted");
    }
    const tasks: TaskType[] = await FetchRequest("GET", "/users/uncompleted");
    return tasks.map(task => ({
        ...task,
        data: {
            ...task.data,
            name: scramble(task.data.name),
        },
    }));
};

const PAGE_SIZE = 50;

const fetchCompleted = async (pageParam: number): Promise<TaskType[]> => {
    return await FetchRequest("GET", `/users/completed/${pageParam}-${PAGE_SIZE}`);
};

const fetchAll = async (): Promise<TaskType[]> => {
    if (!store.get(isDemoMode)) {
        return await FetchRequest("GET", "/users/allUserTasks");
    }
    const tasks: TaskType[] = await FetchRequest("GET", "/users/allUserTasks");
    return tasks.map(task => ({
        ...task,
        data: {
            ...task.data,
            name: scramble(task.data.name),
        },
    }));
};

export const loadUncompletedItemsQuery = () => ({
    queryKey: ['uncompletedUserItems'],
    queryFn: fetchUncompleted,
});

export const loadCompletedItemsQuery = () => ({
    queryKey: ['completedUserItems'],
    queryFn: ({pageParam = 0}: { pageParam?: number }) => fetchCompleted(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage: TaskType[], _allPages: TaskType[][], lastPageParam: number) => {
        if (lastPage.length === PAGE_SIZE) {
            return (lastPageParam as number) + PAGE_SIZE;
        } else {
            return undefined;
        }
    },
});

export const loadAllItemsQuery = () => ({
    queryKey: ['allUserItems'],
    queryFn: fetchAll,
});