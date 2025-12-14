import {useQuery} from "@tanstack/react-query"
import {Box, Flex, Show} from "@chakra-ui/react";
import Task from "@/components/items/Task.tsx";
import loadItemsQuery from "@/queries/LoadItemsQuery.tsx";
import type {Task as TaskType} from "@/types/Task.ts";
import {groupByMonth, sortCompletedTasks, sortFutureTasks, sortSomeday} from '@/functions/Sorting.tsx'
import {isDatePast} from "@/functions/Dates.tsx";
import GroupMarker from "@/components/lists/GroupMarker.tsx";
import {useBreakpointValue} from "@chakra-ui/react";
import {useAtomValue} from "jotai";
import {filterContentAtom} from "@/global/atoms.ts";

const MainList = () => {

    const {data: itemList} = useQuery<TaskType[]>(loadItemsQuery());

    const [filterContent] = useAtomValue(filterContentAtom);

    const adjacent = useBreakpointValue({base: false, md: true}) as boolean;

    const applyContentFilter = (item: TaskType) => {
        if (!filterContent || filterContent.length === 0) return true;
        return item.data.tags.some(tag => filterContent.includes(tag.tagID));
    }

    if (!itemList) {
        return <div>Loading...</div>;
    }

    const tasks = itemList.filter((task) => task.data.date);

    const someday = itemList
        .filter((item) => !item.data.date)
        .filter((item) => !item.data.completed)
        .filter((item) => applyContentFilter(item))
        .sort(sortSomeday);

    const futureTasks = tasks
        .filter((task) => !task.data.completed)
        .filter((task) => !isDatePast(task.data.date))
        .filter((task) => applyContentFilter(task))
        .sort(sortFutureTasks);

    const overdueTasks = tasks
        .filter((task) => !task.data.completed)
        .filter((task) => isDatePast(task.data.date))
        .filter((task) => applyContentFilter(task))
        .sort(sortFutureTasks);

    const completedItems = itemList
        .filter((item) => item.data.completed).sort(sortCompletedTasks)
        .filter((item) => applyContentFilter(item));

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
                <Box key={ym} position="relative" mt="30px">
                    <Box key={ym} bg="primary" position="relative">
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

    const renderSomeday = (someday: TaskType[]) => {
        if (someday.length === 0) return;
        return (
            <Box position="relative" mt="30px">
                <Box bg="primary.darker" position="relative" p="10px" borderRadius="5px">
                    <GroupMarker text={"Someday"} adjacent={false}/>
                    {someday.map((item) => (
                        <Box key={item.itemID} position="relative" mb="2">
                            <Task {...item} />
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    return (
        <Flex direction="column" height="100%" justifyContent="flex-end" m="0 auto">
            <Box overflowY="scroll" scrollbarWidth="none">
                <Box w={{base: "92%", sm: "90%", md: "55%"}} mx="auto" position="relative" top="100px"
                     paddingBottom="100px">
                    {renderGroupedTasks(futureTasks)}

                    {renderGroupedTasks(overdueTasks)}

                    {renderSomeday(someday)}

                    {renderGroupedTasks(completedItems, true)}
                </Box>
            </Box>
        </Flex>
    );
};

export default MainList;