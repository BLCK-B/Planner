import type {Task as TaskType} from "@/types/Task.ts";

export const customSort = (a: TaskType, b: TaskType): number => {
    const aCompleted = Boolean(a.data.completed);
    const bCompleted = Boolean(b.data.completed);

    if (aCompleted && !bCompleted) return 1;
    if (!aCompleted && bCompleted) return -1;

    const aDate = new Date(a.data?.date).getTime();
    const bDate = new Date(b.data?.date).getTime();

    return bDate - aDate;
};

export const sortGoals = (a: TaskType, b: TaskType) => {
    return a.data.name.toLowerCase().localeCompare(b.data.name.toLowerCase());
};

export const sortFutureTasks = (a: TaskType, b: TaskType): number => {
    const aDate = new Date(a.data?.date).getTime();
    const bDate = new Date(b.data?.date).getTime();

    return bDate - aDate;
};

export const sortCompletedTasks = (a: TaskType, b: TaskType): number => {
    const aDate = new Date(a.data?.completed).getTime();
    const bDate = new Date(b.data?.completed).getTime();

    return bDate - aDate;
};