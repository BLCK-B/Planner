import {Popover, Box, Card, Flex, IconButton} from "@chakra-ui/react";
import MyTag from "@/components/items/MyTag.tsx";
import {useQuery} from "@tanstack/react-query";
import {type TagType} from "@/types/TagType.ts";
import loadTagsQuery from "@/queries/LoadTagsQuery.tsx";
import {useAtom} from "jotai";
import {filterContentAtom} from "@/global/atoms.ts";
import {FaStar} from "react-icons/fa6";

const FilterSelects = () => {

    const {data: tags} = useQuery<TagType[]>(loadTagsQuery());

    const [filterContent, setFilterContent] = useAtom(filterContentAtom);

    if (!tags) {
        return <></>;
    }

    const applyTagFilter = (tag: TagType) => {
        const isAssigned = filterContent.tagIds.some(tagId => tagId === tag.tagID);
        let updatedTags;
        if (isAssigned) {
            updatedTags = filterContent.tagIds.filter(tagId => tagId !== tag.tagID);
        } else {
            updatedTags = [...filterContent.tagIds, tag.tagID];
        }
        setFilterContent({
            ...filterContent,
            tagIds: updatedTags
        });
    };

    const applyImportantFilter = () => {
        setFilterContent({
            ...filterContent,
            important: !filterContent.important,
        });
    };

    const isInactive = (tag: TagType) => {
        return !filterContent.tagIds.some(tagId => tagId === tag.tagID);
    }

    const importantStyle = () => {
        return filterContent.important ? "theme.BrightYellow" : "primary.lighterer";
    }

    return (
        <Popover.Positioner>
            <Popover.Content width="350px" boxShadow="xs">
                <Popover.Body p="0" border="2px solid grey" borderRadius="md">
                    <Card.Root variant="elevated" bg="primary.lighter" boxShadow="none">
                        <Card.Body color="primary.contrast">
                            <Flex wrap="wrap" gap="0.6rem">
                                {tags.map((tag, i) => (
                                    <Box key={i} onClick={() => applyTagFilter(tag)}>
                                        <MyTag tag={tag} isEditable={false} isInactive={isInactive(tag)}/>
                                    </Box>
                                ))}
                            </Flex>
                            <IconButton
                                mt="1.2rem"
                                onClick={() => applyImportantFilter()}
                                size="xs"
                                w="1px"
                                aria-label={"important"}
                                bg={importantStyle()}
                                color="black"
                            >
                                <FaStar/>
                            </IconButton>
                        </Card.Body>
                    </Card.Root>
                </Popover.Body>
            </Popover.Content>
        </Popover.Positioner>
    );
};

export default FilterSelects;
