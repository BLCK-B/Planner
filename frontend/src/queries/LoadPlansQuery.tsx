import FetchRequest from "@/scripts/FetchRequest.tsx";
import type {Plan as PlanType} from "@/types/Plan.ts";
import type {BackendResponseItem} from "@/types/BackendResponseItem.ts";
import {enforcePlan} from "@/util/dataEnforcer.ts";

const fetchItems = async () => {
    const items = await FetchRequest("GET", "/users/userPlans");
    const parsedItems: PlanType[] = items.map((item: BackendResponseItem) => ({
        itemID: item.itemID,
        data: JSON.parse(item.data) as PlanType["data"],
    }));
    return parsedItems.map(plan => enforcePlan(plan));
};

export const loadPlansQuery = () => ({
    queryKey: ['userPlans'],
    queryFn: fetchItems,
});

export default loadPlansQuery;