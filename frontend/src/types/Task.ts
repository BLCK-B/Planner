export type Task = {
    itemID: string;
    data: {
        itemType: 'Task' | 'Goal';
        name: string;
        date: string; // target completion date
        deadline: boolean;
        tags: string[];
        completed: string; // date of completion - empty if not completed
        repeatEvent: '' | 'week' | 'two-weeks' | 'month'; // create copy when completed
        repeatOriginDay: number; // for month repeat option to prevent day shifting
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
        repeatEvent: '',
        repeatOriginDay: 0,
    },
} as const;