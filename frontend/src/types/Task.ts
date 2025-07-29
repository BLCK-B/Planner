export type Task = {
    itemID: string;
    data: {
        name: string;
        date: string;
        deadline: boolean;
        type: string;
        tags: string[];
        completed?: string;
    };
};
