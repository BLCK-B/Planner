export type Task = {
    itemID: string;
    data: {
        itemType: 'Task' | 'Goal';
        name: string;
        date: string; // target completion date
        tags: string[];
        completed: string; // date of completion - empty if not completed
        repeatEvent: '' | 'week' | 'two-weeks' | 'month'; // create copy when completed
        repeatOriginDay: number; // for month repeat option to prevent day shifting
        planID: string; // task can be a part of plan
    };
};

type EncryptSpec = {
    [K in keyof Task["data"]]: boolean;
};

export const TaskEncryptSpec: EncryptSpec = {
    itemType: false,
    name: true,
    date: true,
    tags: false,
    completed: true,
    repeatEvent: false,
    repeatOriginDay: false,
    planID: false,
};

export const newTask: Task = {
    itemID: '',
    data: {
        itemType: 'Task',
        name: '',
        date: '',
        tags: [],
        completed: '',
        repeatEvent: '',
        repeatOriginDay: 0,
        planID: '',
    },
} as const;