import FetchRequest from "@/functions/FetchRequest.tsx";
import type {InitiativeType} from "@/types/InitiativeType.ts";

const fetchItems = async (): Promise<InitiativeType[]> => {
    return await FetchRequest("GET", "/users/userInitiatives");
};

export const loadInitiativesQuery = () => ({
    queryKey: ['userInitiatives'],
    queryFn: fetchItems,
});

export default loadInitiativesQuery;