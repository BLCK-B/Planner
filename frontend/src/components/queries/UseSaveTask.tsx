import {useMutation, useQueryClient} from "@tanstack/react-query";
import fetchRequest from "@/scripts/fetchRequest.tsx";
import loadItemsQuery from "@/components/queries/LoadItemsQuery.tsx";
import type {Task as TaskType} from "@/types/Task";

const saveRequest = async (task: TaskType): Promise<TaskType[]> => {
    return await fetchRequest("PUT", "/users/userTask", task);
};

const useSaveTask = () => {
    const queryClient = useQueryClient();

    return useMutation<TaskType[], Error, TaskType>({
        mutationFn: saveRequest,
        onSuccess: () => {
            const queryKey = loadItemsQuery().queryKey;
            queryClient.invalidateQueries({queryKey});
        },
        onError: (error) => {
            console.error("Error saving task:", error);
        },
    });
};

export default useSaveTask;
