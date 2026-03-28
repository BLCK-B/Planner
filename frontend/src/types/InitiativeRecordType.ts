export type InitiativeRecordType = {
    data: {
        recordID: string;
        comment: string;
        rating: number;
        date: string;
    }
};

type EncryptSpec = {
    [K in keyof InitiativeRecordType["data"]]: boolean;
};

export const InitiativeRecordEncryptSpec: EncryptSpec = {
    recordID: false,
    comment: true,
    rating: false,
    date: false,
};

const newInitiativeRecordType: InitiativeRecordType = {
    data: {
        recordID: '',
        comment: '',
        rating: 6,
        date: '',
    },
} as const;

export const getNewInitiativeRecord = (): InitiativeRecordType => {
    newInitiativeRecordType.data.recordID = crypto.randomUUID();
    return structuredClone(newInitiativeRecordType);
}