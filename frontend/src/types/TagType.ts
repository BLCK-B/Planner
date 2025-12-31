export type TagType = {
    tagID: string;
    data: {
        tagName: string;
        color: string;
        isTracked: boolean;
        description: string;
    };
};

type EncryptSpec = {
    [K in keyof TagType["data"]]: boolean;
};

export const TagEncryptSpec: EncryptSpec = {
    tagName: true,
    color: false,
    isTracked: false,
    description: true,
};

const newTag: TagType = {
    tagID: '',
    data: {
        tagName: '',
        color: 'rgb(128, 128, 128)',
        isTracked: false,
        description: '',
    },
} as const;

export const getNewTag = (): TagType => structuredClone(newTag);