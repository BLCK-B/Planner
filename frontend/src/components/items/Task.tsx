import {Box, Text, Flex, Show} from "@chakra-ui/react";
import {
    isDatePast,
    getTodaysDate,
    getNextDate,
    globalDateFormatter
} from "@/functions/Dates.tsx";
import type {TaskType} from "@/types/TaskType.ts";
import * as React from "react";
import useSaveTask from "@/queries/UseSaveTask.tsx";
import {useAtomValue, useSetAtom} from 'jotai';
import {showExactDatesAtom, existingItemForEdit, showAddDialog} from '@/global/atoms.ts';
import MyTag from "@/components/items/MyTag.tsx";
import loadItemsQuery from "@/queries/LoadItemsQuery.tsx";
import {useQueryClient} from "@tanstack/react-query";
import CompleteSection from "@/components/base/CompleteSection.tsx";
import {LuGoal} from "react-icons/lu";

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

    const toggleCompleted = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const newTask = task;
        if (!task.data.completed) {
            newTask.data.completed = String(getTodaysDate());
        } else {
            newTask.data.completed = '';
        }
        await saveTaskMutation.mutateAsync(newTask);

        if (newTask.data.repeatEvent !== 'none' && newTask.data.date && newTask.data.completed) {
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
        <Flex bg="primary.lighter"
              color="primary.contrast"
              mb="3.5"
              borderRadius="md"
              cursor="button"
              position="relative"
              justifyContent="space-between"
              onClick={handleClick}
              {...(task.data.important && styles.important)}
              {...(!task.data.completed && isDatePast(task.data.date) && task.data.date && {bg: "theme.Reddish"})}>
            <Box p="2">
                <Flex align="center" justifyContent="space-between">
                    <Show when={task.data.date && !task.data.completed}>
                        <Flex w="120px" align="center" gap="5px">
                            <Text>{globalDateFormatter(task, showExactDates)}</Text>
                        </Flex>
                    </Show>
                    <Text mr="5px">{task.data.name}</Text>
                    {task.data.plan && (
                        <LuGoal color={task.data.plan.data.color}/>
                    )}
                </Flex>
                <Show when={task.data.tags.length}>
                    <Flex mt="5px" gap={2}>
                        {task.data.tags.map((tag, index) => (
                            <MyTag key={index} tag={tag}/>
                        ))}
                    </Flex>
                </Show>
            </Box>
            <CompleteSection onClick={toggleCompleted} isCompleted={Boolean(task.data.completed)}
                             isRepeat={task.data.repeatEvent !== 'none'}/>
        </Flex>
    );
};

export default Task;

const styles = {
    important: {
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "theme.BrightYellow",
    },
};