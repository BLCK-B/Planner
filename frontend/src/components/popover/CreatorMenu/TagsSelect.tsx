import {Popover, Grid, Box, Button} from "@chakra-ui/react";
import MyTag from "@/components/items/MyTag.tsx";
import {useQuery} from "@tanstack/react-query";
import {type TagType} from "@/types/TagType.ts";
import loadTagsQuery from "@/queries/LoadTagsQuery.tsx";
import type {Task} from "@/types/Task.ts";
import {router, tagsEditRoute} from "@/routes/__root.tsx";

type Props = {
    item: Task
}

const TagsSelect = ({item}: Props) => {

    const {data: tags} = useQuery<TagType[]>(loadTagsQuery());

    const assignTag = (tag: TagType) => {
        item.data.tags = [...item.data.tags, tag.data.tagName];
    };

    const goToEditPage = () => {
        router.navigate({to: tagsEditRoute.fullPath});
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
                                <MyTag tag={tag} isEditable={false}/>
                            </Box>
                        ))}
                    </Grid>
                </Popover.Body>
                <Button borderRadius="0 0 5px 5px" bg="primary.lighterer" onClick={goToEditPage}>Edit tags</Button>
            </Popover.Content>
        </Popover.Positioner>
    );
};

export default TagsSelect;
