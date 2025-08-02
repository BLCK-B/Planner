import {useState} from "react";
import {Box, Checkbox, Flex, Input} from "@chakra-ui/react";
import {useTaskContext} from "@/TaskContext.tsx";
import {isDatePast} from "@/scripts/Dates.tsx";
import {Field} from "@/components/ui/field";
import ButtonConfirm from "@/components/base/ButtonConfirm.tsx";
import ButtonDelete from "@/components/base/ButtonDelete.tsx";
import useSaveTask from "@/queries/UseSaveTask.tsx"
import useDeleteTask from "@/queries/UseDeleteTask.tsx"
import type {Task} from "@/types/Task.ts";
import * as React from "react";
import OneTag from "@/components/base/OneTag.tsx";
import {Tag} from "@/components/ui/tag";

type Props = {
    task: Task;
};

const TaskExpanded = ({task}: Props) => {
    const {handleCollapseTask} = useTaskContext();

    const saveTaskMutation = useSaveTask();
    const deleteTaskMutation = useDeleteTask();

    const [localTask, setLocalTask] = useState<Task>(task);

    const setNewNameAt = (index: number, newName: string) => {
        const newTags = localTask.data.tags;
        newTags[index] = newName;
        setLocalTask(prev => ({
            ...prev,
            data: {
                ...prev.data,
                tags: newTags,
            },
        }));
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalTask(prev => ({
            ...prev,
            data: {
                ...prev.data,
                name: e.target.value,
            },
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalTask(prev => ({
            ...prev,
            data: {
                ...prev.data,
                date: e.target.value,
            },
        }));
    };

    const handleAddTag = () => {
        setLocalTask(prev => ({
            ...prev,
            data: {
                ...prev.data,
                tags: [...(prev.data.tags ?? []), ""],
            },
        }));
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setLocalTask(prev => ({
            ...prev,
            data: {
                ...prev.data,
                tags: (prev.data.tags ?? []).filter(tag => tag !== tagToRemove),
            },
        }));
    };

    const handleCheckboxChange = (details: { checked: boolean }) => {
        setLocalTask(prev => ({
            ...prev,
            data: {
                ...prev.data,
                deadline: details.checked,
            },
        }));
    };

    const handleClick = () => {
        // handleCollapseTask();
    };

    const handleConfirmClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        await saveTaskMutation.mutateAsync(localTask);
        handleCollapseTask();
    };

    const handleDeleteTaskLocal = async () => {
        await deleteTaskMutation.mutateAsync(localTask);
    };

    return (
        <Box
            p="2"
            bg="base.100"
            color="black"
            borderRadius="md"
            boxShadow="sm"
            mb="4"
            onClick={handleClick}
            cursor="button"
            {...(isDatePast(task.data.date) && {bg: "red.400"})}
            {...(task.data.completed && {bg: "green.100"})}>
            {/* inputs */}
            <Flex gap="6" align="center" justifyContent="start">
                {/*<Input p="2px" variant="subtle" type="date" value={localTask.data.date} onChange={handleDateChange}/>*/}
                <Flex style={styles.dateFlex}>
                    <Input p="2px" variant="subtle" type="date" value={localTask.data.date}
                           onChange={handleDateChange}/>
                    <Checkbox.Root checked={localTask.data.deadline}
                                   onCheckedChange={handleCheckboxChange} size={"md"}>
                        <Checkbox.HiddenInput/>
                        <Checkbox.Label>Deadline</Checkbox.Label>
                        <Checkbox.Control>
                            <Checkbox.Indicator/>
                        </Checkbox.Control>
                    </Checkbox.Root>
                </Flex>
                <Field invalid={!localTask.data.name}>
                    <Input p="2px" variant="subtle" value={localTask.data.name} placeholder="Task name"
                           onChange={handleNameChange}/>
                </Field>
            </Flex>
            {/* tags */}
            <Flex>
                {/* tag list */}
                {localTask.data.tags.map((tagName, index) => (
                    <OneTag key={index} name={tagName}
                            setNewName={(newName: string) => setNewNameAt(index, newName)} deleteTag={handleRemoveTag}/>
                ))}
                {/* add tag button */}
                {handleAddTag && localTask.data.tags.length <= 2 && (
                    <Tag onClick={handleAddTag} variant="surface">
                        + tag
                    </Tag>
                )}
            </Flex>
            {/* buttons */}
            <Flex gap="6" align="center" justifyContent="center">
                <ButtonConfirm disabled={!localTask.data.name} onClick={handleConfirmClick}/>
                <ButtonDelete onClick={handleDeleteTaskLocal}/>
            </Flex>
        </Box>
    );
};

export default TaskExpanded;

const styles = {
    dateFlex: {
        gap: "0.5rem",
    }
};
