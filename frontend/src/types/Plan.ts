export type Plan = {
    itemID: string;
    data: {
        name: string;
        description: string;
        color: string;
        completed: string;
    };
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