import {Box, Checkbox, Editable, Flex, Spacer, Text} from "@chakra-ui/react";
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
import * as React from "react";

const SubtasksList = () => {

    const {workItemId} = useParams({from: worklistSubtasksRoute.id});

    const saveWorkItemMutation = useSaveWorkItem();

    const {data: workItem, isLoading} = useQuery(loadWorkItemQuery(workItemId));

    const [newSubtasks, setNewSubtasks] = useState<SubtaskType[]>([]);

    useEffect(() => {
        if (workItem?.data.subtasks) {
            setNewSubtasks(workItem.data.subtasks);
        }
    }, [workItem]);

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    // todo: reliable save on copy paste
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
            wait: 1000,
            leading: true,
            trailing: true,
        }
    );

    const updateSubtask = useCallback(
        (index: number, key: keyof typeof newSubtasks[number]["data"], value: any) => {
            setNewSubtasks(prev => {
                if (value === '') {
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
    
    const dragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', '');
    };

    const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const dragDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;
        setNewSubtasks(prev => {
            const newOrder = [...prev];
            const [draggedItem] = newOrder.splice(draggedIndex, 1);
            newOrder.splice(dropIndex, 0, draggedItem);
            return newOrder;
        });
        throttledSave();
        setDraggedIndex(null);
    };

    const dragEnd = () => {
        setDraggedIndex(null);
    };

    const addSubTask = () => {
        setNewSubtasks(prev => [...prev, getNewSubtask()]);
    };

    const returnToWorkItems = () => {
        throttledSave();
        router.navigate({to: worklistRoute.fullPath});
    };

    if (isLoading) return <></>;

    return (
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
                                <Flex
                                    key={i}
                                    color="primary.contrast"
                                    borderRadius="md"
                                    position="relative"
                                    justifyContent="space-between"
                                    bg={draggedIndex === i ? "primary.darker" : "transparent"}
                                    transition="background-color 0.2s ease"
                                    pr="0.3rem"
                                    mb="0.3rem"
                                >
                                    <Box
                                        userSelect="none"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontSize="lg"
                                        draggable
                                        onDragStart={(e) => dragStart(e, i)}
                                        onDragOver={dragOver}
                                        onDrop={(e) => dragDrop(e, i)}
                                        onDragEnd={dragEnd}
                                        cursor="grab"
                                        p="0.3rem"
                                    >
                                        ⋮⋮
                                    </Box>
                                    <Editable.Root
                                        value={subtask.data.name}
                                        onValueChange={(e) => updateSubtask(i, "name", e.value)}
                                        ml="0.3rem"
                                    >
                                        <Editable.Preview
                                            w="100%"
                                            _hover={{
                                                bg: "primary.lighter",
                                            }}
                                        />
                                        <Editable.Textarea
                                            maxLength={150}
                                            w="100%"
                                            resize="none"
                                            _selection={{
                                                bg: "theme.Spruit2",
                                                color: "black",
                                            }}
                                        />
                                    </Editable.Root>
                                    <Checkbox.Root
                                        checked={subtask.data.completed}
                                        onCheckedChange={() =>
                                            updateSubtask(i, "completed", !subtask.data.completed)
                                        }
                                        variant="subtle"
                                        draggable={false}
                                    >
                                        <Checkbox.HiddenInput/>
                                        <Checkbox.Control bg="primary.lighter"/>
                                    </Checkbox.Root>
                                </Flex>
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
                                <Flex
                                    key={i}
                                    color="primary.contrast"
                                    borderRadius="md"
                                    position="relative"
                                    justifyContent="space-between"
                                    bg={draggedIndex === i ? "primary.darker" : "transparent"}
                                    transition="background-color 0.2s ease"
                                    pr="0.3rem"
                                    mb="0.3rem"
                                >
                                    <Box
                                        userSelect="none"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontSize="lg"
                                        draggable
                                        onDragStart={(e) => dragStart(e, i)}
                                        onDragOver={dragOver}
                                        onDrop={(e) => dragDrop(e, i)}
                                        onDragEnd={dragEnd}
                                        cursor="grab"
                                        p="0.3rem"
                                    >
                                        ⋮⋮
                                    </Box>
                                    <Editable.Root
                                        value={subtask.data.name}
                                        onValueChange={(e) => updateSubtask(i, "name", e.value)}
                                        ml="0.3rem"
                                    >
                                        <Editable.Preview
                                            w="100%"
                                            _hover={{
                                                bg: "primary.lighter",
                                            }}
                                        />
                                        <Editable.Textarea
                                            maxLength={150}
                                            w="100%"
                                            resize="none"
                                            _selection={{
                                                bg: "theme.Spruit2",
                                                color: "black",
                                            }}
                                        />
                                    </Editable.Root>
                                    <Checkbox.Root
                                        checked={subtask.data.completed}
                                        onCheckedChange={() =>
                                            updateSubtask(i, "completed", !subtask.data.completed)
                                        }
                                        variant="subtle"
                                        draggable={false}
                                    >
                                        <Checkbox.HiddenInput/>
                                        <Checkbox.Control
                                            bg="primary.lighter"
                                            _checked={{
                                                bg: "theme.Spruit1"
                                            }}
                                        />
                                    </Checkbox.Root>
                                </Flex>
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

    );
};

export default SubtasksList;