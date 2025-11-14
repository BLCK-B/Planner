import {Popover, Grid, Button} from "@chakra-ui/react";
import TagView from "@/components/items/TagView.tsx";
import {tagsEditRoute} from "@/routes/__root.tsx";
import {useRouter} from "@tanstack/react-router";

const TagsSelect = ({x = 3, y = 3}) => {
    const predefinedTags = Array.from({length: x * y - 1}, (_, i) => `Tag ${i + 1}`);

    const router = useRouter();

    const openEditPage = () => {
        router.navigate({to: tagsEditRoute.fullPath});
    };

    return (
        <Popover.Positioner>
            <Popover.Content width="380px" bg="primary.lighter">
                <Popover.Body>
                    <Grid
                        templateColumns={`repeat(${x}, 1fr)`}
                        columnGap={2}
                        rowGap={3}
                        userSelect="none"
                    >
                        {predefinedTags.map((tag, i) => (
                            <TagView key={i} name={tag}/>
                        ))}
                    </Grid>
                </Popover.Body>
                <Button borderRadius="0 0 5px 5px" bg="primary.base" onClick={openEditPage}>
                    Edit tags
                </Button>
            </Popover.Content>
        </Popover.Positioner>
    );
};

export default TagsSelect;
