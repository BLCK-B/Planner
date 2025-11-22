import {useMutation, useQueryClient} from "@tanstack/react-query";
import FetchRequest from "@/functions/FetchRequest.tsx";
import loadTagsQuery from "@/queries/LoadTagsQuery.tsx";
import type {TagType} from "@/types/TagType.ts";

const deleteRequest = async (tag: TagType): Promise<TagType[]> => {
    return await FetchRequest("DELETE", `/users/userTag/${tag.tagID}`);
};

const useDeleteTag = () => {
    const queryClient = useQueryClient();

    return useMutation<TagType[], Error, TagType>({
        mutationFn: deleteRequest,
        onSuccess: () => {
            const queryKey = loadTagsQuery().queryKey;
            queryClient.invalidateQueries({queryKey});
        },
        onError: (error) => {
            console.error("Error saving tag:", error);
        },
    });
};

export default useDeleteTag;
