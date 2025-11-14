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

export const newTag: TagType = {
    tagID: '',
    data: {
        tagName: '',
        color: 'rgb(255, 255, 255)',
    },
} as const;