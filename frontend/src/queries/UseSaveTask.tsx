import {useMutation} from "@tanstack/react-query";
import FetchRequest from "@/functions/FetchRequest.tsx";
import type {TaskType} from "@/types/TaskType.ts";

const saveRequest = async (task: TaskType): Promise<TaskType[]> => {
    return await FetchRequest("PUT", "/users/userTask", task);
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
