import {useQuery} from "@tanstack/react-query"
import {Box, Flex, Show, Text} from "@chakra-ui/react";
import Task from "@/components/items/Task.tsx";
import loadItemsQuery from "@/queries/LoadItemsQuery.tsx";
import type {Task as TaskType} from "@/types/Task.ts";
import {customSort} from '@/scripts/Sorting.tsx'
import {isDatePast} from "@/scripts/Dates.tsx";

const ItemsWithDate = () => {
    const {data: itemList} = useQuery<TaskType[]>(loadItemsQuery());

    if (!itemList) {
        return <div>Loading...</div>;
    }

    const tasks = itemList.filter((task) => task.data.itemType === "Task");

    const futureTasks = tasks
        .filter((task) => !task.data.completed)
        .filter((task) => !isDatePast(task.data.date))
        .sort(customSort);

    const overdueTasks = tasks
        .filter((task) => !task.data.completed)
        .filter((task) => isDatePast(task.data.date))
        .sort(customSort);

    const completedTasks = tasks.filter((task) => task.data.completed).sort(customSort);

    const groupByMonth = (tasks: TaskType[]) => {
        return tasks.reduce<Record<string, TaskType[]>>((acc, task) => {
            const ym = task.data.date.slice(0, 7);
            if (!acc[ym]) {
                acc[ym] = [];
            }
            acc[ym].push(task);
            return acc;
        }, {});
    };
    
    const renderGroupedTasks = (tasks: TaskType[]) => {
        const groups = groupByMonth(tasks);

        return Object.entries(groups).map(([ym, groupTasks]) => {
            const dateMarker = (
                <Flex
                    direction="column"
                    justify="center"
                    position="absolute"
                    ml="-120px"
                    top="50%"
                    transform="translateY(-50%)"
                    height="100%"
                    bg="gray.100"
                    borderRadius="5px"
                    w="80px"
                    align="center"
                >
                    <Text color="gray.500" whiteSpace="nowrap">
                        {new Date(groupTasks[0].data.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                        })}
                    </Text>
                </Flex>
            );

            return (
                <Box key={ym} position="relative">
                    {dateMarker}
                    {groupTasks.map((task) => (
                        <Box key={task.itemID} position="relative" mb="2">
                            <Task {...task} />
                        </Box>
                    ))}
                </Box>
            );
        });
    };

    return (
        <Flex direction="column" height="100%" w="100%" style={styles.deadlineList}>
            <Box style={{overflowY: "scroll", scrollbarWidth: "none"}}>
                <Box w={{base: "82%", sm: "70%", md: "65%"}} mx="auto" position="relative" top="150px">
                    {renderGroupedTasks(futureTasks)}

                    <Show when={overdueTasks.length > 0}>
                        <Text color="red">
                            Late
                        </Text>
                    </Show>

                    {renderGroupedTasks(overdueTasks)}

                    <Show when={completedTasks.length > 0}>
                        <Text color="gray.600">
                            Completed
                        </Text>
                    </Show>

                    {renderGroupedTasks(completedTasks)}
                </Box>
            </Box>
        </Flex>
    );
};

export default ItemsWithDate;

const styles = {
    deadlineList: {
        justifyContent: "flex-end",
        margin: "0 auto",
    },
};
