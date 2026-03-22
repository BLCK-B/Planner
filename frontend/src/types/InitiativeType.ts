import type {InitiativeRecordType} from "@/types/InitiativeRecordType.ts";

export type InitiativeType = {
    itemID: string;
    data: {
        name: string;
        records: InitiativeRecordType[];
    };
};

type EncryptSpec = {
    [K in keyof InitiativeType["data"]]: boolean;
};

export const InitiativeEncryptSpec: EncryptSpec = {
    name: true,
    records: false,
};

const newInitiative: InitiativeType = {
    itemID: '',
    data: {
        name: '',
        records: [],
    },
} as const;

export const getNewInitiative = (): InitiativeType => structuredClone(newInitiative);