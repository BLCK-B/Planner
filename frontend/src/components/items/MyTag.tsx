import {Tag} from "@chakra-ui/react";
import {useSetAtom} from "jotai";
import {existingTagForEdit, showTagCreator} from "@/global/atoms.ts";
import {getNewTag} from "@/types/TagType.ts";

type Props = {
    name: string;
    bg?: string;
    isEditable?: boolean;
    isNewButton?: boolean;
};

const MyTag = ({name, bg = "primary.base", isEditable = true, isNewButton = false}: Props) => {

    const setShowAddTagDialog = useSetAtom(showTagCreator);

    const setEditTag = useSetAtom(existingTagForEdit);

    const clicked = () => {
        if (isNewButton) {
            createNewTag();
        } else if (isEditable) {
            editExistingTag();
        }
    };

    const createNewTag = () => {
        setEditTag(getNewTag());
        setShowAddTagDialog(true);
    };

    const editExistingTag = () => {
        setEditTag(getNewTag());
        setShowAddTagDialog(true);
    };

    return (
        <Tag.Root variant="surface" style={styles.tag} bg={bg} color="primary.contrast"
                  onClick={clicked}>
            <Tag.Label>
                {name}
            </Tag.Label>
        </Tag.Root>
    );
};

export default MyTag;

const styles = {
    tag: {
        height: "25px",
    },
};
