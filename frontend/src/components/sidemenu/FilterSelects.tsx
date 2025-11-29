import {Popover, Grid, Box, Card} from "@chakra-ui/react";
import MyTag from "@/components/items/MyTag.tsx";
import {useQuery} from "@tanstack/react-query";
import {type TagType} from "@/types/TagType.ts";
import loadTagsQuery from "@/queries/LoadTagsQuery.tsx";
import {useAtom} from "jotai";
import {filterContentAtom} from "@/global/atoms.ts";

const FilterSelects = () => {

    const {data: tags} = useQuery<TagType[]>(loadTagsQuery());

    const [filterContent, setFilterContent] = useAtom(filterContentAtom);

    if (!tags) {
        return <></>;
    }

    const applyTagFilter = (tag: TagType) => {
        const content = filterContent ?? [];
        const isAssigned = content.some(tagId => tagId === tag.tagID);
        let updatedTags;
        if (isAssigned) {
            updatedTags = content.filter(tagId => tagId !== tag.tagID);
        } else {
            updatedTags = [...content, tag.tagID];
        }
        setFilterContent(updatedTags);
    };

    const isInactive = (tag: TagType) => {
        const content = filterContent ?? [];
        return !content.some(tagId => tagId === tag.tagID);
    }

    return (
        <Popover.Positioner>
            <Popover.Content width="350px" bg="primary.darker">
                <Popover.Body p="0.35rem">
                    <Card.Root variant="elevated" bg="primary.lighter">
                        <Card.Header color="primary.contrast">
                            Filter by tags
                        </Card.Header>
                        <Card.Body color="primary.contrast">
                            <Grid
                                templateColumns={`repeat(3, 1fr)`}
                                columnGap={2}
                                rowGap={3}
                                userSelect="none"
                            >
                                {tags.map((tag, i) => (
                                    <Box key={i} onClick={() => applyTagFilter(tag)}>
                                        <MyTag tag={tag} isEditable={false} isInactive={isInactive(tag)}/>
                                    </Box>
                                ))}
                            </Grid>
                        </Card.Body>
                    </Card.Root>
                </Popover.Body>
            </Popover.Content>
        </Popover.Positioner>
    );
};

export default FilterSelects;
