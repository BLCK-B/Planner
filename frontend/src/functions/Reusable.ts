import type {InitiativeType} from "@/types/InitiativeType.ts";

export const getPendingInitiatives = (initiatives: InitiativeType[] | undefined): InitiativeType[] => {
    if (!initiatives) return [];

    const pendingInitiatives: InitiativeType[] = [];

    for (const initiative of initiatives) {
        if (!initiative.data.records.length) continue;
        const lastRecordDate = new Date(Math.max(
            ...initiative.data.records.map(r => new Date(r.data.date).getTime())
        ));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastDate = new Date(lastRecordDate);
        lastDate.setHours(0, 0, 0, 0);
        lastDate.setDate(lastDate.getDate() + initiative.data.remindDays);
        if (today >= lastDate) {
            pendingInitiatives.push(initiative);
        }
    }
    return pendingInitiatives;
};