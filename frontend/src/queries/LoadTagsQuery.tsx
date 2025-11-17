import FetchRequest from "@/functions/FetchRequest.tsx";
import type {TagType} from "@/types/TagType.ts";
import {parseItemData} from "@/functions/Parsing.ts";
import type {TemporaryResponseItemBecauseOfNameTodo} from "@/types/TemporaryResponseItemBecauseOfNameTodo.ts";

const fetchTags = async () => {
    const items = await FetchRequest("GET", "/users/userTags");
    const parsedItems: TagType[] = items.map((item: TemporaryResponseItemBecauseOfNameTodo) => ({
        tagID: item.tagID,
        data: parseItemData(item),
    }));
    return parsedItems;
};

export const loadTagsQuery = () => ({
    queryKey: ['userTags'],
    queryFn: fetchTags,
});

export default loadTagsQuery;