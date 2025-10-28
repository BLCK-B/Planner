import {useMutation} from "@tanstack/react-query";
import FetchRequest from "@/functions/FetchRequest.tsx";
import type {Plan as PlanType} from "@/types/Plan.ts";

const saveRequest = async (plan: PlanType): Promise<PlanType[]> => {
    return await FetchRequest("PUT", "/users/userPlan", plan);
};

const useSavePlan = () => {
    return useMutation<PlanType[], Error, PlanType>({
        mutationFn: saveRequest,
        onError: (error) => {
            console.error("Error saving plan:", error);
        },
    });
};

export default useSavePlan;
