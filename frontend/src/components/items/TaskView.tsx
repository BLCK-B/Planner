import {Box, Text, Flex, Spacer, Show} from "@chakra-ui/react";
import {
    isDatePast,
    globalDateFormatter
} from "@/functions/Dates.tsx";
import type {Task as TaskType} from "@/types/Task.ts";
import {useAtomValue} from 'jotai';
import {showExactDatesAtom} from '@/global/atoms.ts';
import {MdEventRepeat} from "react-icons/md";
import TagView from "@/components/items/TagView.tsx";

const TaskView = (task: TaskType) => {

    const showExactDates = useAtomValue(showExactDatesAtom);

    return (
        <Box
            p="2"
            bg="primary.lighter"
            color="black"
            borderRadius="md"
            boxShadow="sm"
            mb="3.5"
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

export default TaskView;
