import FetchRequest from "@/functions/FetchRequest.tsx";
import type {PlanType} from "@/types/PlanType.ts";
import {isDemoMode} from "@/global/atoms.ts";
import {store} from "@/queries/LoadItemsQuery.tsx";
import {scramble} from "@/functions/Crypto.ts";

const fetchPlans = async (): Promise<PlanType[]> => {
    if (!store.get(isDemoMode)) {
        return await FetchRequest("GET", "/users/userPlans");
    }
    const plans: PlanType[] = await FetchRequest("GET", "/users/userPlans");
    return plans.map(plan => ({
        ...plan,
        data: {
            ...plan.data,
            name: scramble(plan.data.name),
            description: scramble(plan.data.description),
        },
    }));
};

export const loadPlansQuery = () => ({
    queryKey: ['userPlans'],
    queryFn: fetchPlans,
});

export default loadPlansQuery;