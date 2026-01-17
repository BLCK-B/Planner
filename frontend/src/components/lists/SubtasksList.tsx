import {Box, Center, Editable, Flex, Spacer, Text} from "@chakra-ui/react";
import {useAtomValue} from 'jotai';
import {selectedWorkitem} from "@/global/atoms.ts";
import CompleteSection from "@/components/base/CompleteSection.tsx";
import MyButton from "@/components/base/MyButton.tsx";
import {useState} from "react";
import {getNewSubtask} from "@/types/SubtaskType.ts";
import {router, worklistRoute} from "@/routes/__root.tsx";

const SubtasksList = () => {

    const workItem = useAtomValue(selectedWorkitem);

    const [newSubtasks, setNewSubtasks] = useState(workItem?.data.subtasks ?? []);

    const updateSubtask = (index: number, key: keyof typeof newSubtasks[number]["data"], value: any) => {
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
    };

    const addSubTask = () => {
        setNewSubtasks(prev => [...prev, getNewSubtask()]);
    };

    const returnToWorkItems = () => {
        router.navigate({to: worklistRoute.fullPath});
    }

    return (
        <Flex direction="column" height="100%" justifyContent="flex-start" m="0 auto" position="relative">
            <Box overflowY="scroll" scrollbarWidth="none">
                <Box w={{base: "95%", sm: "90%", md: "62%", lg: "50%"}} mx="auto"
                     position="relative" top="4.8rem"
                     paddingBottom="100px" animation="fade-in 0.05s">
                    <Box p="0.3rem">
                        {newSubtasks?.map((subtask, i) => (
                            <Flex
                                key={i}
                                bg={subtask.data.completed ? "theme.Spruit1" : "primary.lighter/70"}
                                color="primary.contrast"
                                mb="0.9rem"
                                borderRadius="md"
                                cursor="pointer"
                                position="relative"
                                justifyContent="space-between"
                                boxShadow="xs"
                            >
                                <Editable.Root
                                    value={subtask.data.name}
                                    onValueChange={(e) => updateSubtask(i, "name", e.value)}
                                    p="0.3rem"
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
                                <CompleteSection
                                    onClick={() => updateSubtask(i, "completed", !subtask.data.completed)}
                                    isCompleted={subtask.data.completed}
                                    isRepeat={false}
                                />
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