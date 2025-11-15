import {Popover, Grid, Show, Box} from "@chakra-ui/react";
import MyTag from "@/components/items/MyTag.tsx";
import {useQuery} from "@tanstack/react-query";
import {type TagType} from "@/types/TagType.ts";
import loadTagsQuery from "@/queries/LoadTagsQuery.tsx";
import type {Task} from "@/types/Task.ts";

type Props = {
    item: Task
}

const TagsSelect = ({item}: Props) => {

    const {data: tags} = useQuery<TagType[]>(loadTagsQuery());

    const assignTag = (tag: TagType) => {
        item.data.tags = [...item.data.tags, tag.data.tagName];
    };

    return (
        <Popover.Positioner>
            <Popover.Content width="380px" bg="primary.lighter">
                <Popover.Body>
                    <Grid
                        templateColumns={`repeat(3, 1fr)`}
                        columnGap={2}
                        rowGap={3}
                        userSelect="none"
                    >
                        {tags && tags.map((tag, i) => (
                            <Box key={i} onClick={() => assignTag(tag)}>
                                <MyTag name={tag.data.tagName} bg={tag.data.color} isEditable={false}/>
                            </Box>
                        ))}
                        <Show when={tags && tags.length <= 4}>
                            <MyTag name="+ tag" isNewButton={true}/>
                        </Show>
                    </Grid>
                </Popover.Body>
            </Popover.Content>
        </Popover.Positioner>
    );
};

export default TagsSelect;
