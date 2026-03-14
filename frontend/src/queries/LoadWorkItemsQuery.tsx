import FetchRequest from "@/functions/FetchRequest.tsx";
import type {WorkItemType} from "@/types/WorkItemType.ts";

const fetchItems = async (): Promise<WorkItemType[]> => {
    return await FetchRequest("GET", "/users/userWorkItems");
};

export const loadWorkItemsQuery = () => ({
    queryKey: ['userWorkItems'],
    queryFn: fetchItems,
});

export default loadWorkItemsQuery;