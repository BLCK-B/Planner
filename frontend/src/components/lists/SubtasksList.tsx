import {Box, Flex, Spacer, Text} from "@chakra-ui/react";
import MyButton from "@/components/base/MyButton.tsx";
import {useCallback, useEffect, useState} from "react";
import {getNewSubtask, type SubtaskType} from "@/types/SubtaskType.ts";
import {router, worklistRoute, worklistSubtasksRoute} from "@/routes/__root.tsx";
import useSaveWorkItem from "@/queries/UseSaveWorkItem.tsx";
import {useThrottledCallback} from "@tanstack/react-pacer";
import type {WorkItemType} from "@/types/WorkItemType.ts";
import {useQuery} from "@tanstack/react-query";
import loadWorkItemQuery from "@/queries/LoadWorkItemQuery.tsx";
import {useParams} from "@tanstack/react-router";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from "react-dnd-touch-backend";
import Subtask from "@/components/items/Subtask.tsx";

const SubtasksList = () => {

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const {workItemId} = useParams({from: worklistSubtasksRoute.id});

    const saveWorkItemMutation = useSaveWorkItem();

    const {data: workItem, isLoading} = useQuery(loadWorkItemQuery(workItemId));

    const [newSubtasks, setNewSubtasks] = useState<SubtaskType[]>([]);

    useEffect(() => {
        if (workItem?.data.subtasks) {
            setNewSubtasks(workItem.data.subtasks);
        }
    }, [workItem]);

    const throttledSave = useThrottledCallback(
        (subtasks: SubtaskType[]) => {
            if (!workItem) return;
            const updatedWorkItem: WorkItemType = {
                itemID: workItem.itemID,
                data: {
                    name: workItem.data.name,
                    subtasks: subtasks,
                },
            };
            saveWorkItemMutation.mutate(updatedWorkItem);
        },
        {
            wait: 1500,
            leading: true,
            trailing: true,
        }
    );

    const immediateSave = (subtasks: SubtaskType[]) => {
        if (!workItem) return;
        const updatedWorkItem: WorkItemType = {
            itemID: workItem.itemID,
            data: {
                name: workItem.data.name,
                subtasks: subtasks,
            },
        };
        saveWorkItemMutation.mutate(updatedWorkItem);
    };

    const toggleSubtaskCompleted = (index: number) => {
        const updated = (() => {
            let next = newSubtasks.map((subtask, i) =>
                i === index
                    ? {
                        ...subtask,
                        data: {
                            ...subtask.data,
                            completed: !subtask.data.completed,
                        },
                    }
                    : subtask
            );

            const item = next[index];
            next = next.filter((_, i) => i !== index);

            const firstCompletedIndex = next.findIndex(s => s.data.completed);

            if (firstCompletedIndex === -1) {
                next.push(item);
            } else {
                next.splice(firstCompletedIndex, 0, item);
            }

            return next;
        })();

        setNewSubtasks(updated);
        immediateSave(updated);
    };

    const removeSubtask = (index: number) => {
        const updated = newSubtasks.filter((_, i) => i !== index);

        setNewSubtasks(updated);
        immediateSave(updated);
    };

    const updateSubtaskText = useCallback((index: number, value: string) => {
            const updated = newSubtasks.map((subtask, i) =>
                i === index
                    ? {
                        ...subtask,
                        data: {
                            ...subtask.data,
                            name: value,
                        },
                    }
                    : subtask
            );
            setNewSubtasks(updated);
            throttledSave(updated);
        },
        [newSubtasks, throttledSave]
    );

    const addSubTask = () => {
        const updated = [...newSubtasks, getNewSubtask()];
        setNewSubtasks(updated);
        immediateSave(updated);
    };

    const moveSubtask = useCallback((from: number, to: number) => {
        const next = [...newSubtasks];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);

        setNewSubtasks(next);
        throttledSave(next);
    }, [newSubtasks, throttledSave]);

    const returnToWorkItems = () => {
        immediateSave(newSubtasks);
        router.navigate({to: worklistRoute.fullPath});
    };

    if (isLoading) return <></>;

    return (
        <DndProvider
            backend={isTouch ? TouchBackend : HTML5Backend}
            options={
                isTouch ? {enableMouseEvents: true, delayTouchStart: 0} : undefined
            }
        >
            <Flex
                direction="column"
                height="100%"
                w={{base: "100%", sm: "85%", md: "62%", lg: "50%"}}
                m="0 auto"
            >
                <Box
                    flex="1"
                    overflowY="auto"
                    paddingBottom="50vh"
                    scrollbarWidth="none" bg="primary.lighter/30"
                >
                    <Box mx="auto" p="0.3rem">
                        {newSubtasks
                            .map((subtask, i) => {
                                if (subtask.data.completed) return null;
                                return (
                                    <Subtask
                                        key={i}
                                        subtask={subtask}
                                        index={i}
                                        moveSubtask={moveSubtask}
                                        updateSubtaskText={updateSubtaskText}
                                        removeSubtask={removeSubtask}
                                        toggleSubtaskCompleted={toggleSubtaskCompleted}
                                    />
                                );
                            })
                        }

                        <Box
                            userSelect="none"
                            display="flex"
                            alignItems="center"
                            fontSize="lg"
                            cursor="text"
                            p="0.3rem"
                            onClick={addSubTask}
                            color="primary.contrast/40"
                        >
                            ⋮⋮
                        </Box>

                        <Box bg="primary" h="2px" w="100%" m="0.3rem 0 0.3rem 0"/>

                        {newSubtasks
                            .map((subtask, i) => {
                                if (!subtask.data.completed) return null;
                                return (
                                    <Subtask
                                        key={i}
                                        subtask={subtask}
                                        index={i}
                                        moveSubtask={moveSubtask}
                                        updateSubtaskText={updateSubtaskText}
                                        removeSubtask={removeSubtask}
                                        toggleSubtaskCompleted={toggleSubtaskCompleted}
                                    />
                                );
                            })
                        }
                    </Box>
                </Box>
                <Flex
                    p="0.6rem"
                    gap="0.6rem"
                    bg="primary.lighter"
                    align="center"
                    w="100%"
                >
                    <Text overflow="hidden">{workItem?.data.name}</Text>
                    <Spacer/>
                    <MyButton type="exit" onClick={returnToWorkItems}/>
                </Flex>
            </Flex>
        </DndProvider>
    );
};

export default SubtasksList;