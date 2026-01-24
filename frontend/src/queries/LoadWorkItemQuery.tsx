import FetchRequest from "@/functions/FetchRequest.tsx";
import type {WorkItemType} from "@/types/WorkItemType.ts";

const fetchItem = async (itemId: string): Promise<WorkItemType> => {
    return await FetchRequest("GET", `/users/userWorkItem/${itemId}`);
};

export const loadWorkItemQuery = (itemId: string) => ({
    queryKey: ['workItem', itemId],
    queryFn: () => fetchItem(itemId),
    staleTime: 0,
    gcTime: 0,
});

export default loadWorkItemQuery;