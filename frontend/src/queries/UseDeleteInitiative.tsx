import {useMutation, useQueryClient} from "@tanstack/react-query";
import FetchRequest from "@/functions/FetchRequest.tsx";
import type {InitiativeType} from "@/types/InitiativeType.ts";
import loadInitiativesQuery from "@/queries/LoadloadInitiativesQuery.tsx";

const deleteRequest = async (item: InitiativeType): Promise<InitiativeType[]> => {
    return await FetchRequest("DELETE", `/users/userInitiative/${item.itemID}`);
};

const useDeleteInitiative = () => {
    const queryClient = useQueryClient();

    return useMutation<InitiativeType[], Error, InitiativeType>({
        mutationFn: deleteRequest,
        onSuccess: () => {
            const queryKey = loadInitiativesQuery().queryKey;
            queryClient.invalidateQueries({queryKey});
        },
        onError: (error) => {
            console.error("Error saving initiative:", error);
        },
    });
};

export default useDeleteInitiative;
