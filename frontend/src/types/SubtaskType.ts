export type SubtaskType = {
    itemID: string;
    data: {
        name: string;
        completed: boolean;
    };
};

type EncryptSpec = {
    [K in keyof SubtaskType["data"]]: boolean;
};

export const SubtaskEncryptSpec: EncryptSpec = {
    name: true,
    completed: false,
};

const newSubtask: SubtaskType = {
    itemID: '',
    data: {
        name: '',
        completed: false,
    },
} as const;

export const getNewSubtask = (): SubtaskType => structuredClone(newSubtask);