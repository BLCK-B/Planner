import FetchRequest from "@/functions/FetchRequest.tsx";
import type {TagType} from "@/types/TagType.ts";

const fetchTags = async (): Promise<TagType[]> => {
    return await FetchRequest("GET", "/users/userTags");
};

export const loadTagsQuery = () => ({
    queryKey: ['userTags'],
    queryFn: fetchTags,
});

export default loadTagsQuery;