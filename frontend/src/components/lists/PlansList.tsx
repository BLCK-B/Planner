import {Box, Flex} from "@chakra-ui/react";
import Plan from '@/components/items/Plan.tsx';
import {useQuery} from "@tanstack/react-query";
import type {TagType} from "@/types/TagType.ts";
import loadTagsQuery from "@/queries/LoadTagsQuery.tsx";

const PlansList = () => {
    const {data: tags} = useQuery<TagType[]>(loadTagsQuery());

    if (!tags) return <div>Loading...</div>;

    const trackedTags = tags.filter(tag => tag.data.isTracked).sort((a, b) => a.data.tagName.localeCompare(b.data.tagName));

    return (
        <Flex direction="column" height="100%" style={{overflowY: "scroll", scrollbarWidth: "none"}}>
            <Box overflowY="scroll" scrollbarWidth="none">
                <Box
                    w={{base: "92%", sm: "90%", md: "65%"}}
                    mx="auto"
                    position="relative"
                    top="50px"
                    paddingBottom="50px"
                >
                    {trackedTags.map((tag) => (
                        <Plan key={tag.tagID} {...tag} />
                    ))}
                </Box>
            </Box>
        </Flex>
    );
};

export default PlansList;
