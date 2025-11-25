import FetchRequest from "@/functions/FetchRequest.tsx";
import type {Task as TaskType} from "@/types/Task.ts";

const fetchTasks = async (): Promise<TaskType[]> => {
    return await FetchRequest("GET", "/users/userTasksAssignedToPlans");
};

export const loadTasksAssignedToPlansQuery = () => ({
    queryKey: ['userTasksAssignedToPlans'],
    queryFn: fetchTasks,
});

export default loadTasksAssignedToPlansQuery;