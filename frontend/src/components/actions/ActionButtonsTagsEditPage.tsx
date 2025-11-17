import {Flex} from "@chakra-ui/react";
import MyButton from "@/components/base/MyButton.tsx";
import {useSetAtom} from "jotai";
import {existingTagForEdit, showTagCreator} from "@/global/atoms.ts";
import {getNewTag} from "@/types/TagType.ts";

const ActionButtonsTagsEditPage = () => {

    const setShowAddDialog = useSetAtom(showTagCreator);

    const setEditTag = useSetAtom(existingTagForEdit);

    const createNewTag = () => {
        setEditTag(getNewTag());
        setShowAddDialog(true);
    };

    return (
        <Flex justify="center" w="80%" ml="20px" justifyContent="flex-start" gap="1em">
            <MyButton type="add" onClick={createNewTag}/>
        </Flex>
    );
};

export default ActionButtonsTagsEditPage;