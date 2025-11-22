import {Box, Text, Flex, Spacer, Show} from "@chakra-ui/react";
import {
    isDatePast,
    globalDateFormatter
} from "@/functions/Dates.tsx";
import type {Task as TaskType} from "@/types/Task.ts";
import {useAtomValue} from 'jotai';
import {showExactDatesAtom} from '@/global/atoms.ts';
import {MdEventRepeat} from "react-icons/md";
import MyTag from "@/components/items/MyTag.tsx";

const TaskView = (task: TaskType) => {

    const showExactDates = useAtomValue(showExactDatesAtom);

    return (
        <Flex bg="primary.lighterer"
              color="primary.contrast"
              mb="3.5"
              borderRadius="md"
              cursor="button"
              position="relative"
              justifyContent="space-between"
              {...(!task.data.completed && isDatePast(task.data.date) && task.data.itemType === "Task" && {bg: "theme.Reddish"})}>
            <Box p="2">
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
                </Flex>
                <Show when={task.data.tags.length}>
                    <Flex mt="5px" gap={2}>
                        {task.data.tags.map((tag, index) => (
                            <MyTag key={index} tag={tag}/>
                        ))}
                    </Flex>
                </Show>
            </Box>
        </Flex>
    );
};

export default TaskView;
