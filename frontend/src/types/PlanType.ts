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