import FetchRequest from "@/functions/FetchRequest.tsx";
import type {Plan as PlanType} from "@/types/Plan.ts";
import type {BackendResponseItem} from "@/types/BackendResponseItem.ts";
import {parseItemData} from "@/functions/Parsing.ts";

const fetchItems = async () => {
    const items = await FetchRequest("GET", "/users/userPlans");
    const parsedItems: PlanType[] = items.map((item: BackendResponseItem) => ({
        itemID: item.itemID,
        data: parseItemData(item),
    }));
    return parsedItems;
};

export const loadPlansQuery = () => ({
    queryKey: ['userPlans'],
    queryFn: fetchItems,
});

export default loadPlansQuery;