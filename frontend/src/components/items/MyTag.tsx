import {Tag} from "@chakra-ui/react";
import {useSetAtom} from "jotai";
import {existingTagForEdit, showTagCreator} from "@/global/atoms.ts";
import type {TagType} from "@/types/TagType.ts";

type Props = {
    tag: TagType;
    isEditable?: boolean;
};

const MyTag = ({tag, isEditable = false,}: Props) => {

    const setShowAddTagDialog = useSetAtom(showTagCreator);

    const setEditTag = useSetAtom(existingTagForEdit);

    const clicked = () => {
        if (isEditable) {
            setEditTag(tag);
            setShowAddTagDialog(true);
        }
    };

    return (
        <Tag.Root variant="surface" style={styles.tag} bg={tag.data.color} color="primary.contrast"
                  onClick={clicked} boxShadow="none">
            <Tag.Label>
                {tag.data.tagName}
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
