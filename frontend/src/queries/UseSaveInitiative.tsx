import {useMutation} from "@tanstack/react-query";
import FetchRequest from "@/functions/FetchRequest.tsx";
import type {InitiativeType} from "@/types/InitiativeType.ts";
import {queryClient} from "@/QueryClient.tsx";
import loadInitiativesQuery from "@/queries/LoadloadInitiativesQuery.tsx";

const saveRequest = async (item: InitiativeType): Promise<InitiativeType[]> => {
    return await FetchRequest("PUT", "/users/userInitiative", item);
};

const useSaveInitiative = () => {
    return useMutation<InitiativeType[], Error, InitiativeType>({
        mutationFn: saveRequest,
        onError: (error) => {
            console.error("Error saving initiative:", error);
        },
        onSuccess: () => {
            const queryKey = loadInitiativesQuery().queryKey;
            queryClient.invalidateQueries({queryKey});
        }
    });
};

export default useSaveInitiative;
