import {Popover, Grid, Show} from "@chakra-ui/react";
import MyTag from "@/components/items/MyTag.tsx";
import {useQuery} from "@tanstack/react-query";
import {type TagType} from "@/types/TagType.ts";
import loadTagsQuery from "@/queries/LoadTagsQuery.tsx";

const TagsSelect = () => {

    const {data: tags} = useQuery<TagType[]>(loadTagsQuery());

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
                            <MyTag key={i} name={tag.data.tagName}/>
                        ))}
                        <Show when={tags && tags.length <= 4}>
                            <MyTag name="new tag" isNewButton={true}/>
                        </Show>
                    </Grid>
                </Popover.Body>
            </Popover.Content>
        </Popover.Positioner>
    );
};

export default TagsSelect;
