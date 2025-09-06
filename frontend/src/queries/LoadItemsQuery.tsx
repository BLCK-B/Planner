import FetchRequest from "@/scripts/FetchRequest.tsx";
import type {Task as TaskType} from "@/types/Task.ts";
import type {BackendResponseItem} from "@/types/BackendResponseItem.ts";
import {enforceTask} from "@/util/dataEnforcer.ts";

const fetchItems = async () => {
    const items = await FetchRequest("GET", "/users/userTasks");
    const parsedItems: TaskType[] = items.map((item: BackendResponseItem) => ({
        itemID: item.itemID,
        data: JSON.parse(item.data) as TaskType["data"],
    }));
    return parsedItems.map(task => enforceTask(task));
};

export const loadItemsQuery = () => ({
    queryKey: ['userItems'],
    queryFn: fetchItems,
});

export default loadItemsQuery;