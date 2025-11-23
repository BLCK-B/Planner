import {useQuery} from "@tanstack/react-query"
import {Box, Button, Card, Center, Flex} from "@chakra-ui/react";
import loadTagsQuery from "@/queries/LoadTagsQuery.tsx";
import {getNewTag, type TagType} from "@/types/TagType.ts";
import MyTag from "@/components/items/MyTag.tsx";
import {mainRoute, router} from "@/routes/__root.tsx";
import MyButton from "@/components/base/MyButton.tsx";
import {useSetAtom} from "jotai";
import {existingTagForEdit, showTagCreator} from "@/global/atoms.ts";

const TagsEditList = () => {

    const {data: tagList} = useQuery<TagType[]>(loadTagsQuery());

    const goBack = () => {
        router.navigate({to: mainRoute.fullPath});
    };

    const setShowAddDialog = useSetAtom(showTagCreator);

    const setEditTag = useSetAtom(existingTagForEdit);

    const createNewTag = () => {
        setEditTag(getNewTag());
        setShowAddDialog(true);
    };

    if (!tagList) {
        return <div>Loading...</div>;
    }
    return (
        <Center>
            <Card.Root w="320px" h="70vh" variant="elevated" bg="primary.lighter" top="50px">
                <Card.Header color="primary.contrast">
                    Tags edit
                </Card.Header>
                <Card.Body gap="2" color="primary.contrast" h="50%">
                    <Flex direction="column" gap={3} overflow="scroll">
                        {tagList
                            .sort((a, b) => a.data.tagName.localeCompare(b.data.tagName))
                            .map((tag) => (
                                <Box key={tag.tagID}>
                                    <MyTag tag={tag} isEditable={true}/>
                                </Box>
                            ))}
                    </Flex>
                </Card.Body>
                <Center>
                    <Card.Footer>
                        <MyButton type="add" onClick={createNewTag}/>
                        <Button size="xs" onClick={goBack}>Return</Button>
                    </Card.Footer>
                </Center>
            </Card.Root>
        </Center>
    );
};

export default TagsEditList;
