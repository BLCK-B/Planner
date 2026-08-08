import {Box, Flex, Show, Spacer, Text} from "@chakra-ui/react";
import MyButton from "@/components/base/MyButton.tsx";
import {useCallback, useEffect, useRef, useState} from "react";
import {getNewSubtask, type SubtaskType} from "@/types/SubtaskType.ts";
import useSaveWorkItem from "@/queries/UseSaveWorkItem.tsx";
import type {WorkItemType} from "@/types/WorkItemType.ts";
import {useQuery} from "@tanstack/react-query";
import loadWorkItemQuery from "@/queries/LoadWorkItemQuery.tsx";
import {useNavigate, useParams} from "@tanstack/react-router";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from "react-dnd-touch-backend";
import Subtask from "@/components/items/Subtask.tsx";

const SubtasksList = () => {

    const navigate = useNavigate();

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const {workItemId} = useParams({from: '/app/worklist/subtasks/$workItemId'});

    const saveWorkItemMutation = useSaveWorkItem();

    const {data: workItem, isLoading} = useQuery(loadWorkItemQuery(workItemId));

    const [newSubtasks, setNewSubtasks] = useState<SubtaskType[]>([]);

    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const prevSubtasksRef = useRef<SubtaskType[] | undefined>(undefined);
    const subtasks = workItem?.data.subtasks;
    if (prevSubtasksRef.current !== subtasks) {
        prevSubtasksRef.current = subtasks;
        setNewSubtasks(subtasks ?? []);
    }

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const immediateSave = (subtasks: SubtaskType[]) => {
        if (!workItem) return;
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }
        const updatedWorkItem: WorkItemType = {
            itemID: workItem.itemID,
            data: {
                name: workItem.data.name,
                subtasks: subtasks,
            },
        };
        saveWorkItemMutation.mutate(updatedWorkItem);
    };

    const debouncedSave = useCallback((subtasks: SubtaskType[]) => {
        if (!workItem) return;

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            const updatedWorkItem: WorkItemType = {
                itemID: workItem.itemID,
                data: {
                    name: workItem.data.name,
                    subtasks: subtasks,
                },
            };
            saveWorkItemMutation.mutate(updatedWorkItem);
        }, 500);
    }, [workItem, saveWorkItemMutation]);

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
            debouncedSave(updated);
        },
        [newSubtasks, debouncedSave]
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
        debouncedSave(next);
    }, [newSubtasks, debouncedSave]);

    const returnToWorkItems = () => {
        immediateSave(newSubtasks);
        navigate({to: '/app/worklist'});
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

                        <Show when={newSubtasks.every(s => s.data.name.trim() !== "")}>
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
                        </Show>

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