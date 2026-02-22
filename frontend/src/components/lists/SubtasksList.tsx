import {Box, Flex, Spacer, Text} from "@chakra-ui/react";
import MyButton from "@/components/base/MyButton.tsx";
import {useState, useCallback, useEffect} from "react";
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
        () => {
            if (!workItem) return;
            const updatedWorkItem: WorkItemType = {
                itemID: workItem.itemID,
                data: {
                    name: workItem.data.name,
                    subtasks: newSubtasks,
                },
            };
            saveWorkItemMutation.mutateAsync(updatedWorkItem);
        },
        {
            wait: 800,
            leading: true,
            trailing: true,
        }
    );

    const immediateSave = () => {
        if (!workItem) return;
        const updatedWorkItem: WorkItemType = {
            itemID: workItem.itemID,
            data: {
                name: workItem.data.name,
                subtasks: newSubtasks,
            },
        };
        saveWorkItemMutation.mutateAsync(updatedWorkItem);
    };

    const updateSubtask = useCallback(
        (index: number, key: keyof typeof newSubtasks[number]["data"], value: any) => {
            setNewSubtasks(prev => {
                // todo: test mobile (otherwise button)
                if (value === '__DELETE__') {
                    return prev.filter((_, i) => i !== index);
                }
                return prev.map((subtask, i) =>
                    i === index
                        ? {
                            ...subtask,
                            data: {
                                ...subtask.data,
                                [key]: value,
                            },
                        }
                        : subtask
                );
            });
            throttledSave();
        },
        []
    );

    const addSubTask = () => {
        setNewSubtasks(prev => [...prev, getNewSubtask()]);
    };

    const moveSubtask = useCallback((from: number, to: number) => {
        setNewSubtasks(prev => {
            const next = [...prev];
            const [item] = next.splice(from, 1);
            next.splice(to, 0, item);
            return next;
        });
        throttledSave();
    }, []);

    const returnToWorkItems = () => {
        immediateSave();
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
                                        updateSubtask={updateSubtask}
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
                                        updateSubtask={updateSubtask}
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