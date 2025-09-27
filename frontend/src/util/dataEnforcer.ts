import type {Plan} from "@/types/Plan.ts";
import {newPlan} from "@/types/Plan.ts";

export const enforcePlan = (plan: Partial<Plan>): Plan => {
    if (!plan || !plan.itemID || !plan.data) {
        throw new Error("illegal structure");
    }
    const newLocalPlan: Plan = JSON.parse(JSON.stringify(newPlan));
    (newLocalPlan.itemID as any) = (plan.itemID as any);
    for (const key in plan.data) {
        if (key in newLocalPlan.data) {
            (newLocalPlan.data as any)[key] = (plan.data as any)[key];
        }
    }

    return newLocalPlan;
};