import {useInfiniteQuery, useQuery} from "@tanstack/react-query"
import {Box, Flex, Show} from "@chakra-ui/react";
import Task from "@/components/items/Task.tsx";
import {loadCompletedItemsQuery, loadUncompletedItemsQuery} from "@/queries/LoadItemsQueries.tsx";
import type {TaskType} from "@/types/TaskType.ts";
import {groupByMonth, sortFutureTasks, sortSomeday} from '@/functions/Sorting.tsx'
import {isDatePast} from "@/functions/Dates.tsx";
import GroupMarker from "@/components/lists/GroupMarker.tsx";
import {useBreakpointValue} from "@chakra-ui/react";
import {useAtomValue} from "jotai";
import {filterContentAtom} from "@/global/atoms.ts";
import {useEffect, useRef} from "react";

const MainList = () => {

    const {data: uncompletedItems} = useQuery<TaskType[]>(loadUncompletedItemsQuery());

    const {
        data: completedPaginatedItems,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery(loadCompletedItemsQuery());

    const filterContent = useAtomValue(filterContentAtom);

    const adjacent = useBreakpointValue({base: false, md: true}) as boolean;

    const applyContentFilter = (item: TaskType) => {
        if (!filterContent || filterContent.length === 0) return true;
        return item.data.tags.some(tag => filterContent.includes(tag.tagID));
    }

    const somedayRef = useRef<HTMLDivElement | null>(null);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    console.log("inter")
                    fetchNextPage();
                }
            },
        );
        const node = loadMoreRef.current;
        if (node) observer.observe(node);
        return () => {
            if (node) observer.unobserve(node);
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    useEffect(() => {
        if (!somedayRef.current || !somedayRef.current.offsetTop) return;
        scrollContainerRef.current?.scrollTo({
            top: somedayRef.current.offsetTop - 400
        });
    }, []);

    if (!uncompletedItems || !completedPaginatedItems) return <></>;

    const tasks = uncompletedItems.filter((task) => task.data.date);

    const someday = uncompletedItems
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

    const completedItems = completedPaginatedItems.pages
        .flat()
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
                <Box key={ym} position="relative" mt="2.4rem">
                    {groupMarker}
                    {groupList}
                </Box>
            ) : (
                <Box key={ym} position="relative" mt="1.2rem">
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
        if (someday.length === 0) return <Box ref={somedayRef}/>;
        return (
            <Box position="relative" mt="2.4rem" ref={somedayRef}>
                <Box bg="primary.darker" position="relative" p="0.3rem 0.6rem 0.3rem 0.6rem" borderRadius="5px">
                    <GroupMarker text={"Someday"} adjacent={false}/>
                    {someday.map((item) => (
                        <Box key={item.itemID} position="relative" mb="0.9rem">
                            <Task {...item} />
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    return (
        <Flex direction="column" height="100%" justifyContent="flex-end" m="0 auto">
            <Box overflowY="scroll" scrollbarWidth="none" ref={scrollContainerRef}>
                <Box w={{base: "95%", sm: "90%", md: "62%", lg: "50%"}} mx="auto"
                     position="relative" top="4.8rem"
                     paddingBottom="100px" animation="fade-in 0.05s">
                    {renderGroupedTasks(futureTasks)}

                    {renderGroupedTasks(overdueTasks)}

                    {renderSomeday(someday)}

                    {renderGroupedTasks(completedItems, true)}

                    <Box ref={loadMoreRef} h="2px" mt="100px" bg="primary.lighter"/>
                </Box>
            </Box>
        </Flex>
    );
};

export default MainList;