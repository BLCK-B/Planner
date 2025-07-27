import {Tag} from "@/components/ui/tag";
import {Editable} from "@chakra-ui/react";

type Props = {
    name: string;
    setNewName: (newName: string) => void;
    deleteTag: (taskId: string) => void;
};

const OneTag = ({name, setNewName, deleteTag}: Props) => {
    return (
        <Tag variant="surface" closable={deleteTag} onClose={() => deleteTag ? deleteTag(name) : null}
             style={styles.tag}>
            <Editable.Root textAlign="start" value={name}
                           onValueChange={(e) => setNewName(e.value)}
                           style={styles.editable} placeholder="New tag">
                <Editable.Preview/>
                <Editable.Input/>
            </Editable.Root>
        </Tag>
    );

};

export default OneTag;

const styles = {
    tag: {
        height: "25px",
    },
    editable: {
        height: "24px",
    }
};
