import {useMutation, useQueryClient} from "@tanstack/react-query";
import FetchRequest from "@/functions/FetchRequest.tsx";
import type {WorkItemType} from "@/types/WorkItemType.ts";
import loadWorkItemsQuery from "@/queries/LoadWorkItemsQuery.tsx";

const deleteRequest = async (item: WorkItemType): Promise<WorkItemType[]> => {
    return await FetchRequest("DELETE", `/users/userWorkItem/${item.itemID}`);
};

const useDeleteWorkItem = () => {
    const queryClient = useQueryClient();

    return useMutation<WorkItemType[], Error, WorkItemType>({
        mutationFn: deleteRequest,
        onSuccess: () => {
            const queryKey = loadWorkItemsQuery().queryKey;
            queryClient.invalidateQueries({queryKey});
        },
        onError: (error) => {
            console.error("Error saving work item:", error);
        },
    });
};

export default useDeleteWorkItem;
