export type Task = {
    itemID: string;
    data: {
        name: string;
        date: string;
        type: string;
        tags: string[];
        completed?: string;
    };
};
