import {Box, Flex, Text, Spacer} from "@chakra-ui/react";
import TaskView from "@/components/items/TaskView.tsx";
import CompletionProgress from "@/components/base/CompletionProgress.tsx";
import {sortFutureTasks, sortSomeday} from "@/functions/Sorting.tsx";
import {isDatePast} from "@/functions/Dates.tsx";
import type {TaskType} from "@/types/TaskType.ts";
import type {TagType} from "@/types/TagType.ts";
import {useQuery} from "@tanstack/react-query";
import loadTasksOfTagQuery from "@/queries/LoadTasksOfTagQuery.tsx";
import {useSetAtom} from "jotai";
import {existingTagForEdit, showTagCreator} from "@/global/atoms.ts";

const Plan = (tag: TagType) => {

    const setShowAddTagDialog = useSetAtom(showTagCreator);

    const setEditTag = useSetAtom(existingTagForEdit);

    const clicked = () => {
        setEditTag(tag);
        setShowAddTagDialog(true);
    };

    const {data: itemList} = useQuery(loadTasksOfTagQuery(tag));

    if (!itemList) return <></>;

    const tasks = itemList.filter((task) => task.data.date);

    const someday = itemList
        .filter((item) => !item.data.date)
        .filter((item) => !item.data.completed)
        .sort(sortSomeday);

    const futureTasks = tasks
        .filter((task) => !task.data.completed)
        .filter((task) => !isDatePast(task.data.date))
        .sort(sortFutureTasks);

    const overdueTasks = tasks
        .filter((task) => !task.data.completed)
        .filter((task) => isDatePast(task.data.date))
        .sort(sortFutureTasks);

    const renderItems = (items: TaskType[]) => {
        if (items.length === 0) return;
        return (
            <Box position="relative" mt="5px">
                {items.map((item) => (
                    <Box key={item.itemID} position="relative" mb="2">
                        <TaskView {...item} />
                    </Box>
                ))}
            </Box>
        );
    };

    const countCompletedTasks = () => {
        return itemList
            .filter((task) => task.data.completed)
            .length;
    };

    return (
        <Box
            p="15px"
            bg={`rgba${tag.data.color.slice(3, -1)}, 0.08)`}
            color="primary.contrast"
            borderRadius="md"
            boxShadow="xs"
            mb="6"
            position="relative"
            cursor="button"
            border={"2px solid " + `rgba${tag.data.color.slice(3, -1)}, 0.4)`}
            _hover={{border: "2px solid " + `rgba${tag.data.color.slice(3, -1)}, 0.6)`}}
            transition="0.1s ease-in-out"
            onClick={clicked}
        >
            <Flex align="center" justifyContent="space-between">
                <Text fontWeight="bold">{tag.data.tagName}</Text>
                <Spacer/>
                <CompletionProgress total={itemList.length} completed={countCompletedTasks()}
                                    color={tag.data.color}/>
            </Flex>
            <Text whiteSpace="pre-line">{tag.data.description}</Text>
            <Flex direction="column" overflow="scroll" p="10px" mt="15px">
                {renderItems(futureTasks)}

                {renderItems(overdueTasks)}

                {renderItems(someday)}
            </Flex>
        </Box>
    );
};

export default Plan;
