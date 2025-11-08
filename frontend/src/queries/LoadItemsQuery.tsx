import FetchRequest from "@/functions/FetchRequest.tsx";
import type {Task as TaskType} from "@/types/Task.ts";
import type {BackendResponseItem} from "@/types/BackendResponseItem.ts";
import {parseItemData} from "@/functions/Parsing.ts";

const fetchItems = async () => {
    const items = await FetchRequest("GET", "/users/userTasks");
    const parsedItems: TaskType[] = items.map((item: BackendResponseItem) => ({
        itemID: item.itemID,
        data: parseItemData(item),
    }));
    return parsedItems;
};

export const loadItemsQuery = () => ({
    queryKey: ['userItems'],
    queryFn: fetchItems,
});

export default loadItemsQuery;