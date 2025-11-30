import {Tag} from "@chakra-ui/react";
import {useSetAtom} from "jotai";
import {existingTagForEdit, showTagCreator} from "@/global/atoms.ts";
import type {TagType} from "@/types/TagType.ts";

type Props = {
    tag: TagType;
    isEditable?: boolean;
    isInactive?: boolean;
};

const MyTag = ({tag, isEditable = false, isInactive = false}: Props) => {

    const setShowAddTagDialog = useSetAtom(showTagCreator);

    const setEditTag = useSetAtom(existingTagForEdit);

    const clicked = () => {
        if (isEditable) {
            setEditTag(tag);
            setShowAddTagDialog(true);
        }
    };

    const inactiveStyle = () => {
        if (isInactive) {
            return styles.inactive;
        }
    };

    return (
        <Tag.Root variant="surface" style={{...styles.tag, ...inactiveStyle()}} bg={tag.data.color}
                  color="primary.contrast"
                  onClick={clicked} boxShadow="none" cursor="pointer"
        >
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
    inactive: {
        opacity: "0.5",
    },
};
