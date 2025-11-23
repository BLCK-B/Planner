import FetchRequest from "@/functions/FetchRequest.tsx";
import type {PlanType} from "@/types/PlanType.ts";

const fetchPlans = async (): Promise<PlanType[]> => {
    return await FetchRequest("GET", "/users/userPlans");
};

export const loadPlansQuery = () => ({
    queryKey: ['userPlans'],
    queryFn: fetchPlans,
});

export default loadPlansQuery;