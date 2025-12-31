import FetchRequest from "@/functions/FetchRequest.tsx";
import type {TaskType} from "@/types/TaskType.ts";
import {createStore} from "jotai";
import {isDemoMode} from "@/global/atoms.ts";
import {scramble} from "@/functions/Crypto.ts";
import type {TagType} from "@/types/TagType.ts";

export const store = createStore();

const fetchItems = async (tagID: string): Promise<TaskType[]> => {
    if (!store.get(isDemoMode)) {
        return await FetchRequest("GET", `/users/allUserTasksOfThisTag/${tagID}`);
    }
    const tasks: TaskType[] = await FetchRequest("GET", `/users/allUserTasksOfThisTag/${tagID}`);
    return tasks.map(task => ({
        ...task,
        data: {
            ...task.data,
            name: scramble(task.data.name),
        },
    }));
};

export const loadTasksOfTagQuery = (tag: TagType) => ({
    queryKey: ['userTasksOfTag', tag.tagID],
    queryFn: () => fetchItems(tag.tagID),
});

export default loadTasksOfTagQuery;