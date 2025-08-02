import {Dialog, Button, Portal, Flex, Input, Checkbox} from "@chakra-ui/react";

import type {Task} from "@/types/Task.ts";
import Tags from "@/components/base/Tags.tsx";
import {Field} from "@/components/ui/field";
import * as React from "react";
import {useState} from "react";
import ButtonConfirm from "@/components/base/ButtonConfirm.tsx";
import useSaveTask from "@/queries/UseSaveTask.tsx";
import {IoAddCircle} from "react-icons/io5";

const CreatorMenu = () => {

    const saveTaskMutation = useSaveTask();

    const newItem: Task = {
        itemID: '',
        data: {
            name: "",
            date: "",
            deadline: true,
            type: "",
            tags: [],
            completed: "",
        },
    };

    const [newItemLocal, setNewItemLocal] = useState<Task>(newItem);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewItemLocal(prev => ({
            ...prev,
            data: {
                ...prev.data,
                name: e.target.value,
            },
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewItemLocal(prev => ({
            ...prev,
            data: {
                ...prev.data,
                date: e.target.value,
            },
        }));
    };

    const handleAddTag = (name: string) => {
        setNewItemLocal(prev => ({
            ...prev,
            data: {
                ...prev.data,
                tags: [...(prev.data.tags ?? []), name],
            },
        }));
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setNewItemLocal(prev => ({
            ...prev,
            data: {
                ...prev.data,
                tags: (prev.data.tags ?? []).filter(tag => tag !== tagToRemove),
            },
        }));
    };

    const handleCheckboxChange = (details: { checked: boolean }) => {
        setNewItemLocal(prev => ({
            ...prev,
            data: {
                ...prev.data,
                deadline: details.checked,
            },
        }));
    };

    const saveItem = async () => {
        await saveTaskMutation.mutateAsync(newItemLocal);
    };

    return (
        <>
            <Dialog.Root size={"sm"}>
                <Dialog.Trigger asChild>
                    <IoAddCircle size="sm" style={styles.openDialogButton}>Open Dialog</IoAddCircle>
                </Dialog.Trigger>
                <Portal>
                    <Dialog.Backdrop/>
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Create a new task</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Flex gap="6" align="start" justifyContent="start" direction="column">
                                    <Field invalid={!newItemLocal.data.name}>
                                        <Input p="2px" variant="subtle" value={newItemLocal.data.name}
                                               placeholder="Task name"
                                               onChange={handleNameChange}/>
                                    </Field>
                                    <Flex style={styles.dateFlex}>
                                        <Input p="2px" variant="subtle" type="date" value={newItemLocal.data.date}
                                               onChange={handleDateChange}/>
                                        <Checkbox.Root checked={newItemLocal.data.deadline}
                                                       onCheckedChange={handleCheckboxChange} size={"md"}>
                                            <Checkbox.HiddenInput/>
                                            <Checkbox.Label>Deadline</Checkbox.Label>
                                            <Checkbox.Control>
                                                <Checkbox.Indicator/>
                                            </Checkbox.Control>
                                        </Checkbox.Root>
                                    </Flex>
                                    <Tags taskTags={newItemLocal.data.tags} handleAddTag={handleAddTag}
                                          handleRemoveTag={handleRemoveTag}/>
                                </Flex>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <ButtonConfirm onClick={saveItem}
                                                   disabled={!newItemLocal.data.name}>Save</ButtonConfirm>
                                </Dialog.ActionTrigger>
                                <Dialog.ActionTrigger asChild>
                                    <Button size="xs" variant="outline">Cancel</Button>
                                </Dialog.ActionTrigger>
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
    openDialogButton: {
        position: "absolute",
        height: "2em",
        width: "2em",
        left: "11em",
        top: "4em",
    },
    dateFlex: {
        position: "relative",
        width: "65%",
        gap: "2rem",
    }
};
