import {useMutation, useQueryClient} from "@tanstack/react-query";
import FetchRequest from "@/functions/FetchRequest.tsx";
import {loadCompletedItemsQuery, loadUncompletedItemsQuery} from "@/queries/LoadItemsQueries.tsx";
import type {TaskType} from "@/types/TaskType.ts";

const deleteRequest = async (task: TaskType): Promise<TaskType[]> => {
    return await FetchRequest("DELETE", `/users/userTask/${task.itemID}`);
};

const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation<TaskType[], Error, TaskType>({
        mutationFn: deleteRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: loadCompletedItemsQuery().queryKey});
            queryClient.invalidateQueries({queryKey: loadUncompletedItemsQuery().queryKey});
        },
        onError: (error) => {
            console.error("Error saving task:", error);
        },
    });
};

export default useDeleteTask;
