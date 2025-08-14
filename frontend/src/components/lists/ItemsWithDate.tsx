import {useQuery} from "@tanstack/react-query"
import {Box, Flex} from "@chakra-ui/react";
import Task from "@/components/items/Task.tsx";
import loadItemsQuery from "@/queries/LoadItemsQuery.tsx";
import type {Task as TaskType} from "@/types/Task.ts";
import {customSort} from '@/scripts/Sorting.tsx'
import {isDatePast} from "@/scripts/Dates.tsx";

const ItemsWithDate = () => {

    const {data: itemList, error} = useQuery<TaskType[]>(loadItemsQuery());

    if (!itemList) {
        return <div>Loading...</div>;
    }

    return (
        <Flex
            direction="column"
            height="100%"
            w="100%"
            style={styles.deadlineList}>
            <Box style={{overflowY: "scroll", scrollbarWidth: "none"}}>
                {/* future */}
                <Box>
                    <Box w={{base: "82%", sm: "70%", md: "65%"}} mx="auto">
                        {itemList
                            .filter(task => task.data.itemType === "Task")
                            .filter(task => !task.data.completed)
                            .filter(task => !isDatePast(task.data.date))
                            .sort(customSort)
                            .map((task) => (
                                <div key={task.itemID}><Task {...task} /></div>
                            ))}
                    </Box>
                </Box>
                {/* overdue */}
                <Box>
                    <Box w={{base: "82%", sm: "70%", md: "65%"}} mx="auto">
                        {itemList
                            .filter(task => task.data.itemType === "Task")
                            .filter(task => !task.data.completed)
                            .filter(task => isDatePast(task.data.date))
                            .sort(customSort)
                            .map((task) => (
                                <div key={task.itemID}><Task {...task} /></div>
                            ))}
                    </Box>
                </Box>
                {/*  completed  */}
                <Box>
                    <Box w={{base: "82%", sm: "70%", md: "65%"}} mx="auto">
                        {itemList
                            .filter(task => task.data.itemType === "Task")
                            .filter(task => task.data.completed)
                            .sort(customSort)
                            .map((task) => (
                                <div key={task.itemID}><Task {...task} /></div>
                            ))}
                    </Box>
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
