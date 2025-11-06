import {useMutation} from "@tanstack/react-query";
import FetchRequest from "@/functions/FetchRequest.tsx";
import type {Task as TaskType} from "@/types/Task.ts";

const saveRequest = async (tasks: TaskType[]): Promise<TaskType[]> => {
    return await FetchRequest("PUT", "/users/updateAllUserTasks", tasks);
};

const useUpdateAllTasks = () => {
    return useMutation<TaskType[], Error, TaskType[]>({
        mutationFn: saveRequest,
        onError: (error) => {
            console.error("Error saving tasks:", error);
        },
    });
};

export default useUpdateAllTasks;
