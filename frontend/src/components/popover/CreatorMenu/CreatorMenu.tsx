import {Dialog, Portal, Flex, Input, Checkbox, Show, Box} from "@chakra-ui/react";
import {Field} from "@/components/ui/field";
import useSaveTask from "@/queries/UseSaveTask.tsx";
import useDeleteTask from "@/queries/UseDeleteTask.tsx";
import {showAddDialog, existingItemForEdit} from "@/global/atoms.ts";
import {useAtom} from "jotai";
import SelectTabs from "@/components/base/SelectTabs.tsx";
import OneTag from "@/components/base/OneTag.tsx";
import {Tag} from "@/components/ui/tag";
import {newTask} from "@/types/Task.ts";
import ButtonConfirm from "@/components/base/ButtonConfirm.tsx";
import ButtonCancel from "@/components/base/ButtonCancel.tsx";
import ButtonDelete from "@/components/base/ButtonDelete.tsx";
import DropSelection from "@/components/base/DropSelection.tsx";

const CreatorMenu = () => {

    const [showDialog, setShowDialog] = useAtom(showAddDialog);

    const [newItem, setNewItem] = useAtom(existingItemForEdit);

    const saveTaskMutation = useSaveTask();

    const deleteTaskMutation = useDeleteTask();

    const updateItem = (key: keyof typeof newItem.data, value: any) => {
        setNewItem(prev => ({
            ...prev,
            data: {
                ...prev.data,
                [key]: value,
            },
        }));
    };

    // TODO: not working, instead handleAddTag
    const addTag = (name: string) => {
        const currentTags = newItem.data.tags ?? [];
        updateItem("tags", [...currentTags, name]);
    };

    const handleAddTag = () => {
        setNewItem(prev => ({
            ...prev,
            data: {
                ...prev.data,
                tags: [...(prev.data.tags ?? []), ""],
            },
        }));
    };

    const removeTag = (tagToRemove: string) => {
        const currentTags = newItem.data.tags ?? [];
        updateItem("tags", currentTags.filter(tag => tag !== tagToRemove));
    };

    const saveItem = async () => {
        await saveTaskMutation.mutateAsync(newItem);
        setNewItem(newTask);
        setShowDialog(false);
    };

    const deleteItem = async () => {
        await deleteTaskMutation.mutateAsync(newItem);
        setNewItem(newTask);
        setShowDialog(false);
    };

    const setNewNameAt = (index: number, newName: string) => {
        const newTags = newItem.data.tags;
        newTags[index] = newName;
        setNewItem(prev => ({
            ...prev,
            data: {
                ...prev.data,
                tags: newTags,
            },
        }));
    };

    const disableSaveRules = () => {
        return !newItem.data.name || (newItem.data.itemType === "Task" && !newItem.data.date);
    };

    const repeatOptions = [
        {label: "Repeat every week", value: "week"},
        {label: "Repeat every 2 weeks", value: "two-weeks"},
        {label: "Repeat every month", value: "month"},
    ];

    return (
        <Dialog.Root size={"sm"} open={showDialog}>
            <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Flex justifyContent="space-between" w="100%">
                                <SelectTabs tabs={["Task", "Goal"]} selected={newItem.data.itemType}
                                            valueChanged={(value) => updateItem("itemType", value)}/>
                                <Show when={newItem !== newTask}>
                                    <ButtonDelete onClick={deleteItem}/>
                                </Show>
                            </Flex>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Flex gap="6" align="start" justifyContent="start" direction="column">
                                <Field invalid={!newItem.data.name}>
                                    <Input p="2px" variant="subtle" value={newItem.data.name}
                                           placeholder="Task name"
                                           onChange={(e) => updateItem("name", e.target.value)}/>
                                </Field>
                                <Show when={newItem.data.itemType === "Task"}>
                                    <Flex style={styles.dateFlex}>
                                        <Field invalid={!newItem.data.date}>
                                            <Input p="2px" variant="subtle" type="date" value={newItem.data.date}
                                                   onChange={(e) => updateItem("date", e.target.value)}/>
                                        </Field>
                                        <Checkbox.Root checked={newItem.data.deadline}
                                                       onCheckedChange={(e) => updateItem("deadline", e.checked)}
                                                       size={"md"}>
                                            <Checkbox.HiddenInput/>
                                            <Checkbox.Label>Deadline</Checkbox.Label>
                                            <Checkbox.Control>
                                                <Checkbox.Indicator/>
                                            </Checkbox.Control>
                                        </Checkbox.Root>
                                    </Flex>
                                    <Box w="215px">
                                        <DropSelection items={repeatOptions} selectedRepeat={newItem.data.repeatEvent}
                                                       onSelect={(repeat) => updateItem("repeatEvent", repeat)}/>
                                    </Box>
                                </Show>
                                {/* tags */}
                                <Flex>
                                    {/* tag list */}
                                    {newItem.data.tags.map((tagName, index) => (
                                        <OneTag key={index} name={tagName}
                                                setNewName={(newName: string) => setNewNameAt(index, newName)}
                                                deleteTag={removeTag}/>
                                    ))}
                                    {/* add tag button */}
                                    <Show when={newItem.data.tags.length <= 2}>
                                        <Tag onClick={handleAddTag} variant="surface">
                                            + tag
                                        </Tag>
                                    </Show>
                                </Flex>
                            </Flex>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <ButtonConfirm onClick={saveItem} disabled={disableSaveRules()}/>
                            <ButtonCancel onClick={() => setShowDialog(false)}/>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default CreatorMenu;

const styles = {
    dateFlex: {
        position: "relative",
        width: "65%",
        gap: "2rem",
    }
};
