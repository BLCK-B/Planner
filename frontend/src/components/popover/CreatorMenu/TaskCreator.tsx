import {Dialog, Portal, Flex, Input, Checkbox, Show, Box, Button, Field, Tag} from "@chakra-ui/react";
import useSaveTask from "@/queries/UseSaveTask.tsx";
import useDeleteTask from "@/queries/UseDeleteTask.tsx";
import {showAddDialog, existingItemForEdit} from "@/global/atoms.ts";
import {useAtom} from "jotai";
import SelectTabs from "@/components/base/SelectTabs.tsx";
import EditableTag from "@/components/base/EditableTag.tsx";
import {newTask} from "@/types/Task.ts";
import ButtonConfirm from "@/components/base/ButtonConfirm.tsx";
import ButtonCancel from "@/components/base/ButtonCancel.tsx";
import ButtonDelete from "@/components/base/ButtonDelete.tsx";
import DropSelection from "@/components/base/DropSelection.tsx";
import loadItemsQuery from "@/queries/LoadItemsQuery.tsx";
import {useQueryClient} from "@tanstack/react-query";
import {getDayNumber} from "@/scripts/Dates.tsx";

const TaskCreator = () => {

    const queryClient = useQueryClient();

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
    // const addTag = (name: string) => {
    //     const currentTags = newItem.data.tags ?? [];
    //     updateItem("tags", [...currentTags, name]);
    // };

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

        const queryKey = loadItemsQuery().queryKey;
        await queryClient.invalidateQueries({queryKey});
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

    const setEventRepeat = (repeat: string) => {
        updateItem("repeatOriginDay", getDayNumber(newItem.data.date));
        updateItem("repeatEvent", repeat);
    };

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
                                <Field.Root invalid={!newItem.data.name}>
                                    <Input p="2px" variant="subtle" value={newItem.data.name}
                                           placeholder="Task name"
                                           onChange={(e) => updateItem("name", e.target.value)}/>
                                </Field.Root>
                                <Show when={newItem.data.itemType === "Task"}>
                                    <Flex style={styles.dateFlex}>
                                        <Field.Root invalid={!newItem.data.date}>
                                            <Input p="2px" variant="subtle" type="date" value={newItem.data.date}
                                                   onChange={(e) => updateItem("date", e.target.value)}/>
                                        </Field.Root>
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
                                                       onSelect={(repeat) => setEventRepeat(repeat)}/>
                                    </Box>
                                </Show>
                                {/* tags */}
                                <Flex>
                                    {/* tag list */}
                                    {newItem.data.tags.map((tagName, index) => (
                                        <EditableTag key={index} name={tagName}
                                                     setNewName={(newName: string) => setNewNameAt(index, newName)}
                                                     deleteTag={removeTag}/>
                                    ))}
                                    {/* add tag button */}
                                    <Show when={newItem.data.tags.length <= 2}>
                                        <Tag.Root onClick={handleAddTag} variant="surface">
                                            <Tag.Label>+ tag</Tag.Label>
                                        </Tag.Root>
                                    </Show>
                                </Flex>
                            </Flex>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Show when={newItem.data.completed}>
                                <Button onClick={() => updateItem("completed", '')}>Uncomplete</Button>
                            </Show>
                            <ButtonConfirm onClick={saveItem} disabled={disableSaveRules()}/>
                            <ButtonCancel onClick={() => setShowDialog(false)}/>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default TaskCreator;

const styles = {
    dateFlex: {
        position: "relative" as "relative",
        width: "65%",
        gap: "2rem",
    }
};
