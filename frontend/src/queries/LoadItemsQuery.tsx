import fetchRequest from "@/scripts/fetchRequest.tsx";
import type {Task as TaskType} from "@/types/Task.ts";
import type {BackendResponse} from "@/types/BackendResponse.ts";
import {enforceTask} from "@/util/dataEnforcer.ts";

export const loadItemsQuery = () => ({
    queryKey: ['userItems'],
    queryFn: fetchItems,
});

const fetchItems = async () => {
    const items = await fetchRequest("GET", "/users/userTasks");
    const parsedItems: TaskType[] = items.map((item: BackendResponse) => ({
        itemID: item.itemID,
        data: JSON.parse(item.data) as TaskType["data"],
    }));
    return parsedItems.map(task => enforceTask(task));
};

export default loadItemsQuery;