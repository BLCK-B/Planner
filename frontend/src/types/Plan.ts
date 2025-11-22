export type Plan = {
    planID: string;
    data: {
        name: string;
        description: string;
        color: string;
        completed: string;
    };
};

type EncryptSpec = {
    [K in keyof Plan["data"]]: boolean;
};

export const PlanEncryptSpec: EncryptSpec = {
    name: true,
    description: true,
    color: false,
    completed: true
};

const newPlan: Plan = {
    planID: '',
    data: {
        name: '',
        description: '',
        color: 'rgb(255, 255, 255)',
        completed: '',
    },
} as const;

export const getNewPlan = (): Plan => structuredClone(newPlan);