import type {TagType} from "@/types/TagType.ts";
import type {PlanType} from "@/types/PlanType.ts";

export type Task = {
    itemID: string;
    data: {
        itemType: 'Task' | 'Goal';
        name: string;
        date: string; // target completion date
        tags: TagType[];
        plan?: PlanType; // TODO: without null?
        completed: string; // date of completion - empty if not completed
        repeatEvent: '' | 'week' | 'two-weeks' | 'month'; // create copy when completed
        repeatOriginDay: number; // for month repeat option to prevent day shifting
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
    plan: false,
    completed: true,
    repeatEvent: false,
    repeatOriginDay: false,
};

const newTask: Task = {
    itemID: '',
    data: {
        itemType: 'Task',
        name: '',
        date: '',
        tags: [],
        plan: undefined,
        completed: '',
        repeatEvent: '',
        repeatOriginDay: 0,
    },
} as const;

export const getNewTask = (): Task => structuredClone(newTask);