import {useQuery} from "@tanstack/react-query"
import {Box, Flex} from "@chakra-ui/react";
import loadTagsQuery from "@/queries/LoadTagsQuery.tsx";
import type {TagType} from "@/types/TagType.ts";
import MyTag from "@/components/items/MyTag.tsx";

const TagsEditList = () => {

    const {data: tagList} = useQuery<TagType[]>(loadTagsQuery());

    if (!tagList) {
        return <div>Loading...</div>;
    }
    return (
        <Box w={{base: "90%", sm: "90%", md: "50%"}} mx="auto" position="relative" top="150px">
            <Flex direction="column" gap={3}>
                {tagList.map((tag) => (
                    <Box key={tag.tagID}>
                        <MyTag tag={tag} isEditable={true}/>
                    </Box>
                ))}
            </Flex>
        </Box>
    );
};

export default TagsEditList;
