export type Task = {
    itemID: string;
    data: {
        itemType: string;
        name: string;
        date: string;
        deadline: boolean;
        tags: string[];
        completed: string;
        // TODO: with time, causes near end days to clip to shortest month last day
        repeatEvent: '' | 'week' | 'two-weeks' | 'month';
    };
};

export const newTask: Task = {
    itemID: '',
    data: {
        itemType: 'Task',
        name: '',
        date: '',
        deadline: true,
        tags: [],
        completed: '',
        repeatEvent: ''
    },
} as const;