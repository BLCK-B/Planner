import {useMutation, useQueryClient} from "@tanstack/react-query";
import FetchRequest from "@/functions/FetchRequest.tsx";
import loadItemsQuery from "@/queries/LoadItemsQuery.tsx";
import type {TaskType} from "@/types/TaskType.ts";

const deleteRequest = async (task: TaskType): Promise<TaskType[]> => {
    return await FetchRequest("DELETE", `/users/userTask/${task.itemID}`);
};

const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation<TaskType[], Error, TaskType>({
        mutationFn: deleteRequest,
        onSuccess: () => {
            const queryKey = loadItemsQuery().queryKey;
            queryClient.invalidateQueries({queryKey});
        },
        onError: (error) => {
            console.error("Error saving task:", error);
        },
    });
};

export default useDeleteTask;
