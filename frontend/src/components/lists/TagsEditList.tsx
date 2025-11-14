import {Box, Center, Grid} from "@chakra-ui/react";
import EditableTag from "@/components/base/EditableTag.tsx";
import MyButton from "@/components/base/MyButton.tsx";
import {loadTagsQuery} from "@/queries/LoadTagsQuery.tsx";
import {useQuery} from "@tanstack/react-query";
import type {TagType} from "@/types/TagType.ts";

const TagsEditList = () => {

    const {data: tags} = useQuery<TagType[]>(loadTagsQuery());

    const setNewNameAt = (index: number, newName: string) => {
        // const newTags = [...tags];
        // newTags[index] = newName;
        // setPredefinedTags(newTags);
    };

    if (!tags) {
        return <div>Loading...</div>;
    }

    return (
        <Box w={{base: "90%", sm: "90%", md: "50%"}} mx="auto" position="relative" top="150px">
            <Grid
                templateColumns={`repeat(${3}, 1fr)`}
                columnGap={2}
                rowGap={3}
            >
                {tags.map((tag, index) => (
                    <EditableTag key={index} name={tag.data.tagName}
                                 setNewName={(newName: string) => setNewNameAt(index, newName)}
                    />
                ))}
            </Grid>
            <Center m="20px">
                <MyButton type="confirm" onClick={() => console.log("a")}/>
            </Center>
        </Box>
    );
};

export default TagsEditList;