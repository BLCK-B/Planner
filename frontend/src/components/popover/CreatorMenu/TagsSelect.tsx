import {Popover, Grid, Box, Button} from "@chakra-ui/react";
import MyTag from "@/components/items/MyTag.tsx";
import {useQuery} from "@tanstack/react-query";
import {type TagType} from "@/types/TagType.ts";
import loadTagsQuery from "@/queries/LoadTagsQuery.tsx";
import {router, tagsEditRoute} from "@/routes/__root.tsx";

type Props = {
    updateTags: (tags: TagType) => void;
};

const TagsSelect = ({updateTags}: Props) => {

    const {data: tags} = useQuery<TagType[]>(loadTagsQuery());

    const assignTag = (tag: TagType) => {
        updateTags(tag);
    };

    const goToEditPage = () => {
        router.navigate({to: tagsEditRoute.fullPath});
    };

    if (!tags) {
        return <div>Loading...</div>;
    }

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
                        {tags.map((tag, i) => (
                            <Box key={i} onClick={() => assignTag(tag)}>
                                <MyTag tag={tag} isEditable={false}/>
                            </Box>
                        ))}
                    </Grid>
                </Popover.Body>
                <Button borderRadius="0 0 5px 5px" bg="theme.Spruit1" color="black" h="2.2rem" onClick={goToEditPage}>Edit
                    tags</Button>
            </Popover.Content>
        </Popover.Positioner>
    );
};

export default TagsSelect;
