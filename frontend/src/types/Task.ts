import type {TagType} from "@/types/TagType.ts";
import type {PlanType} from "@/types/PlanType.ts";

export type Task = {
    itemID: string;
    data: {
        name: string;
        date: string; // target completion date
        tags: TagType[];
        plan?: PlanType; // TODO: without null?
        completed: string; // date of completion - empty if not completed
        repeatEvent: 'none' | 'week' | 'two-weeks' | 'month'; // create copy when completed
        repeatOriginDay: number; // for month repeat option to prevent day shifting
        important: boolean;
    };
};

type EncryptSpec = {
    [K in keyof Task["data"]]: boolean;
};

export const TaskEncryptSpec: EncryptSpec = {
    name: true,
    date: true,
    tags: false,
    plan: false,
    completed: true,
    repeatEvent: false,
    repeatOriginDay: false,
    important: false,
};

const newTask: Task = {
    itemID: '',
    data: {
        name: '',
        date: '',
        tags: [],
        plan: undefined,
        completed: '',
        repeatEvent: 'none',
        repeatOriginDay: 0,
        important: false,
    },
} as const;

export const getNewTask = (): Task => structuredClone(newTask);