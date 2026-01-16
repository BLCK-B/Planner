import {useMutation} from "@tanstack/react-query";
import FetchRequest from "@/functions/FetchRequest.tsx";
import type {WorkItemType} from "@/types/WorkItemType.ts";

const saveRequest = async (item: WorkItemType): Promise<WorkItemType[]> => {
    return await FetchRequest("PUT", "/users/userWorkItem", item);
};

const useSaveWorkItem = () => {
    return useMutation<WorkItemType[], Error, WorkItemType>({
        mutationFn: saveRequest,
        onError: (error) => {
            console.error("Error saving work item:", error);
        },
    });
};

export default useSaveWorkItem;
