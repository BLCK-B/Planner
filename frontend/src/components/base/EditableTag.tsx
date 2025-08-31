import {Editable, Show, Tag} from "@chakra-ui/react";

type Props = {
    name: string;
    setNewName: (newName: string) => void;
    deleteTag: (taskId: string) => void;
};

const EditableTag = ({name, setNewName, deleteTag}: Props) => {
    return (
        <Tag.Root variant="surface" style={styles.tag}>
            <Tag.Label>
                <Editable.Root textAlign="start" value={name}
                               onValueChange={(e) => setNewName(e.value)}
                               style={styles.editable} placeholder="New tag">
                    <Editable.Preview/>
                    <Editable.Input/>
                </Editable.Root>
            </Tag.Label>
            <Show when={deleteTag}>
                <Tag.EndElement>
                    <Tag.CloseTrigger onClick={() => deleteTag ? deleteTag(name) : null}/>
                </Tag.EndElement>
            </Show>
        </Tag.Root>
    );
};

export default EditableTag;

const styles = {
    tag: {
        height: "25px",
    },
    editable: {
        height: "24px",
    }
};
