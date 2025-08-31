export type Plan = {
    itemID: string;
    data: {
        name: string;
        description: string;
        taskIDs: string[];
        color: string;
        status: 'active' | 'paused' | 'completed' | 'cancelled';
    };
};

export const newPlan: Plan = {
    itemID: '',
    data: {
        name: '',
        description: '',
        taskIDs: [],
        color: '',
        status: 'active',
    },
} as const;