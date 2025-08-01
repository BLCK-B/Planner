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