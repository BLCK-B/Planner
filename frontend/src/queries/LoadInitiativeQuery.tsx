import FetchRequest from "@/functions/FetchRequest.tsx";
import type {InitiativeType} from "@/types/InitiativeType.ts";

const fetchItem = async (itemId: string): Promise<InitiativeType> => {
    return await FetchRequest("GET", `/users/userInitiative/${itemId}`);
};

export const loadInitiativeQuery = (itemId: string) => ({
    queryKey: ['initiative', itemId],
    queryFn: () => fetchItem(itemId),
    staleTime: 0,
    gcTime: 0,
});

export default loadInitiativeQuery;