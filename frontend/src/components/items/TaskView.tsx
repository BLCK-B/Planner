import {Box, Text, Flex, Show} from "@chakra-ui/react";
import {
    isDatePast,
    globalDateFormatter
} from "@/functions/Dates.tsx";
import type {TaskType} from "@/types/TaskType.ts";
import {useAtomValue} from 'jotai';
import {showExactDatesAtom} from '@/global/atoms.ts';
import MyTag from "@/components/items/MyTag.tsx";

const TaskView = (task: TaskType) => {

    const showExactDates = useAtomValue(showExactDatesAtom);

    return (
        <Flex bg="primary.lighter/70"
              color="primary.contrast"
              mb="0.9rem"
              borderRadius="md"
              cursor="button"
              position="relative"
              justifyContent="space-between"
              boxShadow="xs"
              {...(task.data.important && styles.important)}
              {...(!task.data.completed && isDatePast(task.data.date) && task.data.date && {bg: "theme.Reddish"})}>
            <Box p="2">
                <Flex align="center" justifyContent="space-between">
                    <Show when={task.data.date && !task.data.completed}>
                        <Flex w="120px" align="center" gap="5px">
                            <Text>{globalDateFormatter(task, showExactDates)}</Text>
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

const styles = {
    important: {
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "theme.BrightYellow",
    },
};