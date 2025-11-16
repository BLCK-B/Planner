import {Tag} from "@chakra-ui/react";
import {useSetAtom} from "jotai";
import {existingTagForEdit, showTagCreator} from "@/global/atoms.ts";
import {getNewTag} from "@/types/TagType.ts";

type Props = {
    name: string;
    bg?: string;
    isEditable?: boolean;
};

const MyTag = ({name, bg = "primary.base", isEditable = true,}: Props) => {

    const setShowAddTagDialog = useSetAtom(showTagCreator);

    const setEditTag = useSetAtom(existingTagForEdit);

    const clicked = () => {
        if (isEditable) {
            editExistingTag();
        }
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
