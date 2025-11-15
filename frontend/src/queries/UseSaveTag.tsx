import {useMutation} from "@tanstack/react-query";
import FetchRequest from "@/functions/FetchRequest.tsx";
import type {TagType} from "@/types/TagType.ts";

const saveRequest = async (plan: TagType): Promise<TagType[]> => {
    return await FetchRequest("PUT", "/users/userTag", plan);
};

const useSaveTag = () => {
    return useMutation<TagType[], Error, TagType>({
        mutationFn: saveRequest,
        onError: (error) => {
            console.error("Error saving tag:", error);
        },
    });
};

export default useSaveTag;
