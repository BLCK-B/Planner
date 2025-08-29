import {useQuery} from "@tanstack/react-query"
import {Box, Flex, Show, Text} from "@chakra-ui/react";
import Task from "@/components/items/Task.tsx";
import loadItemsQuery from "@/queries/LoadItemsQuery.tsx";
import type {Task as TaskType} from "@/types/Task.ts";
import {customSort, sortCompletedTasks, sortFutureTasks, sortGoals} from '@/scripts/Sorting.tsx'
import {isDatePast} from "@/scripts/Dates.tsx";

const ItemsWithDate = () => {
    const {data: itemList} = useQuery<TaskType[]>(loadItemsQuery());

    if (!itemList) {
        return <div>Loading...</div>;
    }

    const tasks = itemList.filter((task) => task.data.itemType === "Task");

    const goals = itemList
        .filter((goal) => goal.data.itemType === "Goal")
        .filter((goal) => !goal.data.completed)
        .filter((goal) => !isDatePast(goal.data.date))
        .sort(sortGoals);

    const futureTasks = tasks
        .filter((task) => !task.data.completed)
        .filter((task) => !isDatePast(task.data.date))
        .sort(sortFutureTasks);

    const overdueTasks = tasks
        .filter((task) => !task.data.completed)
        .filter((task) => isDatePast(task.data.date))
        .sort(sortFutureTasks);

    const completedTasks = itemList.filter((item) => item.data.completed).sort(sortCompletedTasks);

    const groupByMonth = (tasks: TaskType[], byCompleted = false) => {
        return tasks.reduce<Record<string, TaskType[]>>((acc, task) => {
            const ym = byCompleted ? task.data.completed.slice(0, 7) : task.data.date.slice(0, 7);
            if (!acc[ym]) {
                acc[ym] = [];
            }
            acc[ym].push(task);
            return acc;
        }, {});
    };

    const renderGroupedTasks = (tasks: TaskType[], byCompletedDate = false) => {
        const groups = groupByMonth(tasks);
        return Object.entries(groups).map(([ym, groupTasks]) => {
            // markers
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
                        <Show when={!byCompletedDate}>
                            {new Date(groupTasks[0].data.date).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                            })}
                        </Show>
                        <Show when={byCompletedDate}>
                            {new Date(groupTasks[0].data.completed).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                            })}
                        </Show>
                    </Text>
                </Flex>
            );
            // marked list
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

    const renderGoals = (goals: TaskType[]) => {
        const dateMarker = (
            <Flex
                direction="column"
                justify="center"
                position="absolute"
                ml="-120px"
                top="50%"
                transform="translateY(-50%)"
                height="100%"
                bg="theme.Peach"
                borderRadius="5px"
                w="80px"
                align="center"
            >
                <Text color="gray.500" whiteSpace="nowrap">
                    Goals
                </Text>
            </Flex>
        );

        return (
            <Box position="relative">
                {dateMarker}
                {goals.map((goal) => (
                    <Box key={goal.itemID} position="relative" mb="2">
                        <Task {...goal} />
                    </Box>
                ))}
            </Box>
        );
    };

    return (
        <Flex direction="column" height="100%" w={{base: "90%", sm: "75%", md: "65%"}} style={styles.deadlineList}>
            <Box style={{overflowY: "scroll", scrollbarWidth: "none"}}>
                <Box w={{base: "82%", sm: "70%", md: "65%"}} mx="auto" position="relative" top="150px">
                    {renderGroupedTasks(futureTasks)}

                    <Show when={overdueTasks.length > 0}>
                        <Text color="red" mt="30px">
                            Late
                        </Text>
                    </Show>
                    {renderGroupedTasks(overdueTasks)}

                    <Show when={goals.length > 0}>
                        <Text color="gray.600" mt="30px">
                            Goals
                        </Text>
                    </Show>
                    {renderGoals(goals)}

                    <Show when={completedTasks.length > 0}>
                        <Text color="gray.600" mt="30px">
                            Completed
                        </Text>
                    </Show>
                    {renderGroupedTasks(completedTasks, true)}
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
