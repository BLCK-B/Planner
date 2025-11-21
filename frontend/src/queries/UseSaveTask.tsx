import {useMutation} from "@tanstack/react-query";
import FetchRequest from "@/functions/FetchRequest.tsx";
import type {Task as TaskType} from "@/types/Task.ts";

const saveRequest = async (task: TaskType): Promise<TaskType[]> => {
    return await FetchRequest("PUT", "/users/userTask", {
        itemID: task.itemID,
        data: task.data,
    });
};

const useSaveTask = () => {
    return useMutation<TaskType[], Error, TaskType>({
        mutationFn: saveRequest,
        onError: (error) => {
            console.error("Error saving task:", error);
        },
    });
};

export default useSaveTask;
