import {Dialog, Button, Portal, Flex, Input, Checkbox, Show} from "@chakra-ui/react";
import type {Task} from "@/types/Task.ts";
import {Field} from "@/components/ui/field";
import * as React from "react";
import {useEffect, useState} from "react";
import ButtonConfirm from "@/components/base/ButtonConfirm.tsx";
import useSaveTask from "@/queries/UseSaveTask.tsx";
import {showAddDialog, showEditDialog} from "@/global/atoms.ts";
import {useAtom} from "jotai";
import SelectTabs from "@/components/base/SelectTabs.tsx";
import OneTag from "@/components/base/OneTag.tsx";
import {Tag} from "@/components/ui/tag";

const CreatorMenu = () => {

    const [showDialog, setShowDialog] = useAtom(showAddDialog);

    const [showDialogExisting, setShowDialogExisting] = useAtom(showEditDialog);

    useEffect(() => {
        if (showDialogExisting !== undefined) {
            setShowDialog(true);
            setNewItemLocal(showDialogExisting);
            setShowDialogExisting(undefined);
        }
    }, [showDialogExisting]);

    const saveTaskMutation = useSaveTask();

    const newItem: Task = {
        itemID: '',
        data: {
            name: "",
            date: "",
            deadline: true,
            tags: [],
            completed: "",
        },
    };

    const [newItemLocal, setNewItemLocal] = useState<Task>(newItem);

    const [itemType, setItemType] = useState("Task");

    const updateItem = (key: keyof typeof newItemLocal.data, value: any) => {
        setNewItemLocal(prev => ({
            ...prev,
            data: {
                ...prev.data,
                [key]: value,
            },
        }));
    };

    const addTag = (name: string) => {
        const currentTags = newItemLocal.data.tags ?? [];
        updateItem("tags", [...currentTags, name]);
    };

    const handleAddTag = () => {
        setNewItemLocal(prev => ({
            ...prev,
            data: {
                ...prev.data,
                tags: [...(prev.data.tags ?? []), ""],
            },
        }));
    };

    const removeTag = (tagToRemove: string) => {
        const currentTags = newItemLocal.data.tags ?? [];
        updateItem("tags", currentTags.filter(tag => tag !== tagToRemove));
    };

    const saveItem = async () => {
        await saveTaskMutation.mutateAsync(newItemLocal);
        setShowDialog(false);
    };

    const setNewNameAt = (index: number, newName: string) => {
        const newTags = newItemLocal.data.tags;
        newTags[index] = newName;
        setNewItemLocal(prev => ({
            ...prev,
            data: {
                ...prev.data,
                tags: newTags,
            },
        }));
    };

    return (
        <>
            <Dialog.Root size={"sm"} open={showDialog}>
                <Portal>
                    <Dialog.Backdrop/>
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Create a new</Dialog.Title>
                                <SelectTabs tabs={["Task", "Goal"]} selected={itemType} valueChanged={setItemType}/>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Flex gap="6" align="start" justifyContent="start" direction="column">
                                    <Field invalid={!newItemLocal.data.name}>
                                        <Input p="2px" variant="subtle" value={newItemLocal.data.name}
                                               placeholder="Task name"
                                               onChange={(e) => updateItem("name", e.target.value)}/>
                                    </Field>
                                    <Show when={itemType === "Task"}>
                                        <Flex style={styles.dateFlex}>
                                            <Input p="2px" variant="subtle" type="date" value={newItemLocal.data.date}
                                                   onChange={(e) => updateItem("date", e.target.value)}/>
                                            <Checkbox.Root checked={newItemLocal.data.deadline}
                                                           onCheckedChange={(e) => updateItem("deadline", e.checked)}
                                                           size={"md"}>
                                                <Checkbox.HiddenInput/>
                                                <Checkbox.Label>Deadline</Checkbox.Label>
                                                <Checkbox.Control>
                                                    <Checkbox.Indicator/>
                                                </Checkbox.Control>
                                            </Checkbox.Root>
                                        </Flex>
                                    </Show>
                                    {/* tags */}
                                    <Flex>
                                        {/* tag list */}
                                        {newItemLocal.data.tags.map((tagName, index) => (
                                            <OneTag key={index} name={tagName}
                                                    setNewName={(newName: string) => setNewNameAt(index, newName)}
                                                    deleteTag={removeTag}/>
                                        ))}
                                        {/* add tag button */}
                                        <Show when={newItemLocal.data.tags.length <= 2}>
                                            <Tag onClick={handleAddTag} variant="surface">
                                                + tag
                                            </Tag>
                                        </Show>
                                    </Flex>
                                </Flex>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <ButtonConfirm onClick={saveItem}
                                               disabled={!newItemLocal.data.name}>Save</ButtonConfirm>
                                <Button size="xs" variant="outline"
                                        onClick={() => setShowDialog(false)}>Cancel</Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
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
