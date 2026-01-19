import {Box, Center, Checkbox, Editable, Flex, Spacer, Text} from "@chakra-ui/react";
import {useAtomValue} from 'jotai';
import {selectedWorkitem} from "@/global/atoms.ts";
import MyButton from "@/components/base/MyButton.tsx";
import {useState, useCallback} from "react";
import {getNewSubtask} from "@/types/SubtaskType.ts";
import {router, worklistRoute} from "@/routes/__root.tsx";

const SubtasksList = () => {
    const workItem = useAtomValue(selectedWorkitem);
    const [newSubtasks, setNewSubtasks] = useState(workItem?.data.subtasks ?? []);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const updateSubtask = useCallback((index: number, key: keyof typeof newSubtasks[number]["data"], value: any) => {
        setNewSubtasks(prev =>
            prev.map((subtask, i) =>
                i === index
                    ? {
                        ...subtask,
                        data: {
                            ...subtask.data,
                            [key]: value,
                        },
                    }
                    : subtask
            )
        );
    }, []);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', '');
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        setNewSubtasks(prev => {
            const newOrder = [...prev];
            const [draggedItem] = newOrder.splice(draggedIndex, 1);
            newOrder.splice(dropIndex, 0, draggedItem);
            return newOrder;
        });
        setDraggedIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const addSubTask = () => {
        setNewSubtasks(prev => [...prev, getNewSubtask()]);
    };

    const returnToWorkItems = () => {
        router.navigate({to: worklistRoute.fullPath});
    };

    return (
        <Flex direction="column" height="100%" justifyContent="flex-start" m="0 auto" position="relative">
            <Box overflowY="scroll" scrollbarWidth="none">
                <Box w={{base: "95%", sm: "90%", md: "62%", lg: "50%"}} mx="auto" position="relative"
                     paddingBottom="100px">
                    <Box p="0.3rem">
                        {newSubtasks.map((subtask, i) => (
                            <Flex
                                key={i}
                                color="primary.contrast"
                                borderRadius="md"
                                position="relative"
                                justifyContent="space-between"
                                bg={draggedIndex === i ? "primary.darker" : "transparent"}
                                transition="background-color 0.2s ease"
                                pr="0.3rem"
                            >
                                <Box
                                    userSelect="none"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontSize="lg"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, i)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, i)}
                                    onDragEnd={handleDragEnd}
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
                                    <Editable.Input
                                        w="100%"
                                        _selection={{
                                            bg: "theme.Spruit2",
                                            color: "black",
                                        }}
                                    />
                                </Editable.Root>
                                <Checkbox.Root
                                    checked={subtask.data.completed}
                                    onCheckedChange={() => updateSubtask(i, "completed", !subtask.data.completed)}
                                    variant="subtle"
                                    draggable={false}
                                >
                                    <Checkbox.HiddenInput/>
                                    <Checkbox.Control bg="primary.lighter"/>
                                </Checkbox.Root>
                            </Flex>
                        ))}
                    </Box>
                </Box>
                <Center>
                    <Flex p="0.6rem" gap="0.6rem" bg="primary.lighter" align="center"
                          borderRadius={{base: "none", sm: "5px 5px 0 0"}} boxShadow="xs"
                          position="absolute" bottom="0" w={{base: "100%", sm: "90%", md: "70%"}}>
                        <Text overflow="hidden">{workItem?.data.name}</Text>
                        <Spacer/>
                        <MyButton type='add' onClick={addSubTask}
                                  disabled={newSubtasks.some(subtask => subtask.data.name.trim() === "")}/>
                        <MyButton type='exit' onClick={returnToWorkItems}/>
                    </Flex>
                </Center>
            </Box>
        </Flex>
    );
};

export default SubtasksList;