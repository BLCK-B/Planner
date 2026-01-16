import {Box, Center, Editable, Flex} from "@chakra-ui/react";
import type {WorkItemType} from "@/types/WorkItemType.ts";
import CompleteSection from "@/components/base/CompleteSection.tsx";
import MyButton from "@/components/base/MyButton.tsx";
import {getNewSubtask} from "@/types/SubtaskType.ts";
import {useState} from "react";

type Props = {
    workItem: WorkItemType;
}

const WorkItem = ({workItem}: Props) => {

    const [newSubtasks, setNewSubtasks] = useState(workItem.data.subtasks ?? [getNewSubtask()]);

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

    return (
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
                        placeholder="Task name"
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
            <Center>
                <MyButton type='add' onClick={addSubTask}
                          disabled={newSubtasks.some(subtask => subtask.data.name.trim() === "")}/>
            </Center>
        </Box>
    );
};

export default WorkItem;
