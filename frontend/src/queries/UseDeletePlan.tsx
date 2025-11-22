import {useMutation, useQueryClient} from "@tanstack/react-query";
import FetchRequest from "@/functions/FetchRequest.tsx";
import loadPlansQuery from "@/queries/LoadPlansQuery.tsx";
import type {Plan as PlanType} from "@/types/Plan.ts";

const deleteRequest = async (plan: PlanType): Promise<PlanType[]> => {
    return await FetchRequest("DELETE", `/users/userPlan/${plan.planID}`);
};

const useDeletePlan = () => {
    const queryClient = useQueryClient();

    return useMutation<PlanType[], Error, PlanType>({
        mutationFn: deleteRequest,
        onSuccess: () => {
            const queryKey = loadPlansQuery().queryKey;
            queryClient.invalidateQueries({queryKey});
        },
        onError: (error) => {
            console.error("Error saving plan:", error);
        },
    });
};

export default useDeletePlan;
