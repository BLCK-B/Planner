export type TagType = {
    tagID: string;
    data: {
        tagName: string;
        color: string;
    };
};

type EncryptSpec = {
    [K in keyof TagType["data"]]: boolean;
};

export const TagEncryptSpec: EncryptSpec = {
    tagName: true,
    color: false,
};

const newTag: TagType = {
    tagID: '',
    data: {
        tagName: '',
        color: 'rgb(128, 128, 128)',
    },
} as const;

export const getNewTag = (): TagType => structuredClone(newTag);