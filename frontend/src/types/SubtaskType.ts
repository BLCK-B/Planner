export type SubtaskType = {
    data: {
        name: string;
        completed: boolean;
    };
};

type EncryptSpec = {
    [K in keyof SubtaskType["data"]]: boolean;
};

export const SubtaskEncryptSpec: EncryptSpec = { // todo: is sent encrypted despite not being implemented? make default error out...
    name: true,
    completed: false,
};

const newSubtask: SubtaskType = {
    data: {
        name: '',
        completed: false,
    },
} as const;

export const getNewSubtask = (): SubtaskType => structuredClone(newSubtask);