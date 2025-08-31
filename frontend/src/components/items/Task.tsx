import {Box, Text, Flex, Spacer, Show} from "@chakra-ui/react";
import {
    isDatePast,
    getTodaysDate,
    getNextDate,
    globalDateFormatter
} from "@/scripts/Dates.tsx";
import ButtonComplete from "@/components/base/ButtonComplete.tsx";
import type {Task as TaskType} from "@/types/Task.ts";
import * as React from "react";
import useSaveTask from "@/queries/UseSaveTask.tsx";
import {useAtomValue, useSetAtom} from 'jotai';
import {showExactDatesAtom, existingItemForEdit, showAddDialog} from '@/global/atoms.ts';
import {MdEventRepeat} from "react-icons/md";
import TagView from "@/components/base/TagView.tsx";
import loadItemsQuery from "@/queries/LoadItemsQuery.tsx";
import {useQueryClient} from "@tanstack/react-query";

const Task = (task: TaskType) => {
    const queryClient = useQueryClient();

    const saveTaskMutation = useSaveTask();

    const showExactDates = useAtomValue(showExactDatesAtom);

    const setShowDialog = useSetAtom(showAddDialog);

    const setEditItem = useSetAtom(existingItemForEdit);

    const handleClick = () => {
        setEditItem(task);
        setShowDialog(true);
    };

    const completeTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const newTask = task;
        newTask.data.completed = String(getTodaysDate());
        await saveTaskMutation.mutateAsync(newTask);

        if (newTask.data.repeatEvent && newTask.data.itemType === 'Task') {
            const newRepeatedTask = structuredClone(task);
            newRepeatedTask.itemID = '';
            newRepeatedTask.data.completed = '';
            newRepeatedTask.data.date = getNextDate(newTask.data.date, newTask.data.repeatEvent, newTask.data.repeatOriginDay);
            await saveTaskMutation.mutateAsync(newRepeatedTask);
        }

        const queryKey = loadItemsQuery().queryKey;
        await queryClient.invalidateQueries({queryKey});
    };

    return (
        <Box
            p="2"
            bg="base.100"
            color="black"
            borderRadius="md"
            boxShadow="sm"
            mb="3.5"
            onClick={handleClick}
            cursor="button"
            {...(isDatePast(task.data.date) && {bg: "theme.ReddishLight"})}
            {...(task.data.completed && {bg: "theme.LightGreen"})}
            position="relative"
        >
            <Flex align="center" justifyContent="space-between">
                <Show when={task.data.itemType === "Task" && !task.data.completed}>
                    <Flex w="120px" align="center" gap="5px">
                        <Text>{globalDateFormatter(task, showExactDates)}</Text>
                        <Show when={task.data.repeatEvent}>
                            <MdEventRepeat color="grey"/>
                        </Show>
                    </Flex>
                </Show>
                <Text>{task.data.name}</Text>
                <Spacer/>
                <Show when={!task.data.completed}>
                    <ButtonComplete onClick={completeTask}/>
                </Show>
                <Show when={task.data.completed}>
                    <Text>✔ {globalDateFormatter(task, showExactDates)}</Text>
                </Show>
            </Flex>
            {task.data.tags!.map((tagName, index) => (
                <TagView key={index} name={tagName}/>
            ))}
        </Box>
    );
};

export default Task;
