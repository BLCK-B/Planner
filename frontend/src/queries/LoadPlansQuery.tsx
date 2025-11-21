import FetchRequest from "@/functions/FetchRequest.tsx";
import type {Plan as PlanType} from "@/types/Plan.ts";

const fetchPlans = async (): Promise<PlanType[]> => {
    return await FetchRequest("GET", "/users/userPlans");
};

export const loadPlansQuery = () => ({
    queryKey: ['userPlans'],
    queryFn: fetchPlans,
});

export default loadPlansQuery;