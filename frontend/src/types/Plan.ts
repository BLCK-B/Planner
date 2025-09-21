export type Plan = {
    itemID: string;
    data: {
        name: string;
        description: string;
        taskIDs: string[]; // tasks in plan, a task can be a part of more plans
        color: string;
        completed: string;
    };
};

export const newPlan: Plan = {
    itemID: '',
    data: {
        name: '',
        description: '',
        taskIDs: [],
        color: 'rgb(255, 255, 255)',
        completed: '',
    },
} as const;