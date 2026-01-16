import type {SubtaskType} from "@/types/SubtaskType.ts";

export type WorkItemType = {
    itemID: string;
    data: {
        name: string;
        subtasks: SubtaskType[];
    };
};

type EncryptSpec = {
    [K in keyof WorkItemType["data"]]: boolean;
};

export const WorkItemEncryptSpec: EncryptSpec = {
    name: true,
    subtasks: false,
};

const newWorkItem: WorkItemType = {
    itemID: '',
    data: {
        name: '',
        subtasks: [],
    },
} as const;

export const getNewWorkItem = (): WorkItemType => structuredClone(newWorkItem);