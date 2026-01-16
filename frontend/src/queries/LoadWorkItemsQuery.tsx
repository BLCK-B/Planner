import FetchRequest from "@/functions/FetchRequest.tsx";
import {createStore} from "jotai";
import {isDemoMode} from "@/global/atoms.ts";
import {scramble} from "@/functions/Crypto.ts";
import type {WorkItemType} from "@/types/WorkItemType.ts";

export const store = createStore();

const fetchItems = async (): Promise<WorkItemType[]> => {
    if (!store.get(isDemoMode)) {
        return await FetchRequest("GET", "/users/userWorkItems");
    }
    const items: WorkItemType[] = await FetchRequest("GET", "/users/userWorkItems");
    return items.map(item => ({
        ...item,
        data: {
            ...item.data,
            name: scramble(item.data.name),
        },
    }));
};

export const loadWorkItemsQuery = () => ({
    queryKey: ['userWorkItems'],
    queryFn: fetchItems,
});

export default loadWorkItemsQuery;