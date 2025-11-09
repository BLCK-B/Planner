export type Plan = {
    itemID: string;
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

export const newPlan: Plan = {
    itemID: '',
    data: {
        name: '',
        description: '',
        color: 'rgb(255, 255, 255)',
        completed: '',
    },
} as const;