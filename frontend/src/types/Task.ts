export type Task = {
    itemID: string;
    data: {
        name: string;
        date: string;
        deadline: boolean;
        tags: string[];
        completed: string;
    };
};
