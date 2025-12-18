import FetchRequest from "@/functions/FetchRequest.tsx";
import type {TaskType} from "@/types/TaskType.ts";

const fetchTasks = async (): Promise<TaskType[]> => {
    return await FetchRequest("GET", "/users/userTasksAssignedToPlans");
};

export const loadTasksAssignedToPlansQuery = () => ({
    queryKey: ['userTasksAssignedToPlans'],
    queryFn: fetchTasks,
});

export default loadTasksAssignedToPlansQuery;