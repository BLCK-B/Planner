import type {Task as TaskType} from "@/types/Task.ts";

export type PlanType = {
    planID: string;
    data: {
        name: string;
        description: string;
        color: string;
        completed: string;
    };
};

type EncryptSpec = {
    [K in keyof PlanType["data"]]: boolean;
};

export const PlanEncryptSpec: EncryptSpec = {
    name: true,
    description: true,
    color: false,
    completed: true
};

const newPlan: PlanType = {
    planID: '',
    data: {
        name: '',
        description: '',
        color: 'rgb(255, 255, 255)',
        completed: '',
    },
} as const;

export const getNewPlan = (): PlanType => structuredClone(newPlan);

type TaskWithoutPlan = Omit<TaskType, "data"> & {
    data: Omit<TaskType["data"], "plan">;
};

export type PlanWithTasks = PlanType & {
    tasks: TaskWithoutPlan[];
};