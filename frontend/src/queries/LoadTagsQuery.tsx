import FetchRequest from "@/functions/FetchRequest.tsx";
import type {TagType} from "@/types/TagType.ts";
import type {BackendResponseItem} from "@/types/BackendResponseItem.ts";
import {parseItemData} from "@/functions/Parsing.ts";

const fetchTags = async () => {
    const items = await FetchRequest("GET", "/users/userTags");
    const parsedItems: TagType[] = items.map((item: BackendResponseItem) => ({
        itemID: item.itemID,
        data: parseItemData(item),
    }));
    return parsedItems;
};

export const loadTagsQuery = () => ({
    queryKey: ['userTags'],
    queryFn: fetchTags,
});

export default loadTagsQuery;