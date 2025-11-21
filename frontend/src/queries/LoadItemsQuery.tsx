import FetchRequest from "@/functions/FetchRequest.tsx";
import type {Task as TaskType} from "@/types/Task.ts";

const fetchItems = async (): Promise<TaskType[]> => {
    return await FetchRequest("GET", "/users/userTasks");
};

export const loadItemsQuery = () => ({
    queryKey: ['userItems'],
    queryFn: fetchItems,
});

export default loadItemsQuery;