export type Task = {
    itemID: string;
    data: {
        itemType: string;
        name: string;
        date: string;
        deadline: boolean;
        tags: string[];
        completed: string;
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
        completed: ''
    },
} as const;