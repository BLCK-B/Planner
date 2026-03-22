export type InitiativeRecordType = {
    data: {
        recordID: string;
        comment: string;
        rating: number;
    }
};

type EncryptSpec = {
    [K in keyof InitiativeRecordType["data"]]: boolean;
};

export const InitiativeRecordEncryptSpec: EncryptSpec = {
    recordID: false,
    comment: true,
    rating: false,
};

const newInitiativeRecordType: InitiativeRecordType = {
    data: {
        recordID: '',
        comment: '',
        rating: 6,
    },
} as const;

export const getNewInitiativeRecord = (): InitiativeRecordType => {
    newInitiativeRecordType.data.recordID = crypto.randomUUID();
    return structuredClone(newInitiativeRecordType);
}