import {Tag} from "@chakra-ui/react";
import {useSetAtom} from "jotai";
import {existingTagForEdit, showAddDialog, showPlanCreator, showTagCreator} from "@/global/atoms.ts";
import {newTag} from "@/types/TagType.ts";

type Props = {
    name: string;
    bg?: string;
    isEditable?: boolean;
    isNewButton?: boolean;
};

const MyTag = ({name, bg = "primary.base", isEditable = true, isNewButton = false}: Props) => {

    const setShowAddTagDialog = useSetAtom(showTagCreator);

    const setEditTag = useSetAtom(existingTagForEdit);

    const setShowTaskDialog = useSetAtom(showAddDialog);
    const setShowPlanDialog = useSetAtom(showPlanCreator);

    const clicked = () => {
        if (isNewButton) {
            createNewTag();
        } else if (isEditable) {
            editExistingTag();
        }
    };

    const createNewTag = () => {
        console.log("create");
        setEditTag(newTag);
        setShowTaskDialog(false);
        setShowPlanDialog(false);
        setShowAddTagDialog(true);
    };

    const editExistingTag = () => {
        console.log("edit");
        setEditTag(newTag);
        setShowTaskDialog(false);
        setShowPlanDialog(false);
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
