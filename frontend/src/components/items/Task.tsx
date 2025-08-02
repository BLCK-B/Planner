import {Box, Text, Flex, Spacer, Show} from "@chakra-ui/react";
import {useTaskContext} from "@/TaskContext.tsx";
import {isDatePast, textualTimeToDate, getDateToday, ddMMyyyy} from "@/scripts/Dates.tsx";
import ButtonComplete from "@/components/base/ButtonComplete.tsx";
import Tags from "@/components/base/Tags.tsx";
import type {Task as TaskType} from "@/types/Task.ts";
import * as React from "react";
import useSaveTask from "@/queries/UseSaveTask.tsx";
import {useAtomValue} from 'jotai';
import {showExactDatesAtom} from '@/atoms.ts';

const Task = (task: TaskType) => {
    const {handleExpandTask} = useTaskContext();

    const saveTaskMutation = useSaveTask();

    const showExactDates = useAtomValue(showExactDatesAtom);

    const handleClick = () => {
        handleExpandTask(task);
    };

    const handleCompleteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // prevent triggering handleClick
        const newTask = task;
        newTask.data.completed = String(getDateToday());
        await saveTaskMutation.mutateAsync(newTask);
    };

    const dateFormatter = (task: TaskType) => {
        if (showExactDates) {
            return ddMMyyyy(task.data.date);
        } else {
            return textualTimeToDate(task.data.date, String(task.data.deadline));
        }
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
            {...(isDatePast(task.data.date) && {bg: "red.400"})}
            {...(task.data.completed && {bg: "green.100"})}
        >
            <Flex align="center" justifyContent="space-between">
                <Show when={task.data.date}>
                    <Text w="120px">{dateFormatter(task)}</Text>
                </Show>
                <Text>{task.data.name}</Text>
                <Spacer/>
                <Show when={!task.data.completed}>
                    <ButtonComplete onClick={handleCompleteClick}/>
                </Show>
                <Show when={task.data.completed}>
                    Completed: {task.data.completed}
                </Show>
            </Flex>
            <Tags taskTags={task.data.tags!}/>
        </Box>
    );
};

export default Task;
