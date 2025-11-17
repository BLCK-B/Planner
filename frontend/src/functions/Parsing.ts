export const parseItemData = (item: any) => {
    let data = {...item.data};
    if (data.tags && data.tags.length > 0) {
        data.tags = JSON.parse(data.tags);
    }
    return data;
}

export const stringifyItemData = (item: any) => {
    let data = {...item.data};
    if (data.tags) {
        data.tags = JSON.stringify(data.tags);
    }
    return data;
};