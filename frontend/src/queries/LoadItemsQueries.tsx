import FetchRequest from "@/functions/FetchRequest.tsx";
import type {TaskType} from "@/types/TaskType.ts";

const fetchUncompleted = async (): Promise<TaskType[]> => {
    return await FetchRequest("GET", "/users/uncompletedUserTasks");
};

const PAGE_SIZE = 50;

const fetchCompleted = async (pageParam: number): Promise<TaskType[]> => {
    return await FetchRequest("GET", `/users/completedUserTasks/${pageParam}-${PAGE_SIZE}`);
};

const fetchAll = async (): Promise<TaskType[]> => {
    return await FetchRequest("GET", "/users/allUserTasks");
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