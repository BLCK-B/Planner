import {useQuery} from "@tanstack/react-query"
import {Box, Flex, Show} from "@chakra-ui/react";
import Task from "@/components/items/Task.tsx";
import loadItemsQuery from "@/queries/LoadItemsQuery.tsx";
import type {Task as TaskType} from "@/types/Task.ts";
import {sortCompletedTasks, sortFutureTasks, sortGoals} from '@/scripts/Sorting.tsx'
import {isDatePast} from "@/scripts/Dates.tsx";
import GroupMarker from "@/components/lists/GroupMarker.tsx";
import {useBreakpointValue} from "@chakra-ui/react";

const MainList = () => {

    const {data: itemList} = useQuery<TaskType[]>(loadItemsQuery());

    const adjacent = useBreakpointValue({base: false, md: true}) as boolean;

    if (!itemList) {
        return <div>Loading...</div>;
    }

    const tasks = itemList.filter((task) => task.data.itemType === "Task");

    const goals = itemList
        .filter((goal) => goal.data.itemType === "Goal")
        .filter((goal) => !goal.data.completed)
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

    const groupByMonth = (tasks: TaskType[], byCompleted: boolean) => {
        return tasks.reduce<Record<string, TaskType[]>>((groupedTasks, task) => {
            const monthKey = byCompleted ? task.data.completed.slice(0, 7) : task.data.date.slice(0, 7);
            if (!groupedTasks[monthKey]) {
                groupedTasks[monthKey] = [];
            }
            groupedTasks[monthKey].push(task);
            return groupedTasks;
        }, {});
    };

    const renderGroupedTasks = (tasks: TaskType[], byCompletedDate = false) => {
        const groups = groupByMonth(tasks, byCompletedDate);
        return Object.entries(groups).map(([ym, groupTasks]) => {

            const dateString = new Date(
                byCompletedDate
                    ? groupTasks[0].data.completed
                    : groupTasks[0].data.date
            ).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
            });

            const groupMarker = (<GroupMarker text={dateString} adjacent={adjacent}/>);

            const groupList = (
                <>
                    {groupTasks.map((task) => (
                        <Box key={task.itemID} position="relative">
                            <Task {...task} />
                        </Box>
                    ))}
                </>
            );

            return adjacent ? (
                <Box key={ym} position="relative" mt="38px">
                    {groupMarker}
                    {groupList}
                </Box>
            ) : (
                <Box key={ym} position="relative" mt="15px">
                    <Box key={ym} bg="primary.base" position="relative" p="10px" borderRadius="5px"
                         border="2px solid #d0d0d0">
                        <Show when={byCompletedDate}>
                            {groupMarker}
                        </Show>
                        {groupList}
                        <Show when={!byCompletedDate}>
                            {groupMarker}
                        </Show>
                    </Box>
                </Box>
            );
        });
    };

    const renderGoals = (goals: TaskType[]) => {
        return (
            <Box position="relative" mt="30px">
                <Box bg="primary.darker" position="relative" p="15px" mb="0.5rem" borderRadius="5px">
                    <GroupMarker text={"Goals"} adjacent={false}/>
                    {goals.map((goal) => (
                        <Box key={goal.itemID} position="relative" mb="2">
                            <Task {...goal} />
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    return (
        <Flex direction="column" height="100%" style={styles.deadlineList}>
            <Box style={{overflowY: "scroll", scrollbarWidth: "none"}}>
                <Box w={{base: "90%", sm: "90%", md: "50%"}} mx="auto" position="relative" top="150px">
                    {renderGroupedTasks(futureTasks)}

                    {renderGroupedTasks(overdueTasks)}

                    {renderGoals(goals)}

                    {renderGroupedTasks(completedTasks, true)}
                </Box>
            </Box>
        </Flex>
    );
};

export default MainList;

const styles = {
    deadlineList: {
        justifyContent: "flex-end",
        margin: "0 auto",
    },
};
