import type {TagType} from "@/types/TagType.ts";
import type {PlanType} from "@/types/PlanType.ts";

export type TaskType = {
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
    [K in keyof TaskType["data"]]: boolean;
};

export const TaskEncryptSpec: EncryptSpec = {
    name: true,
    date: false,
    tags: false,
    plan: false,
    completed: false,
    repeatEvent: false,
    repeatOriginDay: false,
    important: false,
};

const newTask: TaskType = {
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

export const getNewTask = (): TaskType => structuredClone(newTask);