import {Box, Flex, Text, ProgressCircle, Spacer} from "@chakra-ui/react";
import {newTask} from "@/types/Task.ts";
import TaskView from "@/components/items/TaskView.tsx";

// name: string;
// description: string;
// taskIDs: string[];
// color: string;
// status: 'active' | 'paused' | 'completed' | 'cancelled';

const dummyTask = newTask;
dummyTask.data.date = String(new Date());
dummyTask.data.name = "Some name";

const Plan = () => {
    return (
        <Box
            p="2"
            bg="base.100"
            color="black"
            borderRadius="md"
            boxShadow="sm"
            mb="3.5"
            position="relative"
        >
            <Flex align="center" justifyContent="space-between">
                <Text>name</Text>
                <Spacer/>
                <ProgressCircle.Root size={"sm"} value={75}>
                    <ProgressCircle.Circle>
                        <ProgressCircle.Track/>
                        <ProgressCircle.Range strokeLinecap="round"/>
                    </ProgressCircle.Circle>
                </ProgressCircle.Root>
            </Flex>
            <Text>Description blablablablablabla ogerugoer oireongow eiongo ewnro ngewrng iewrno
                gernognowierno</Text>
            <Flex direction="column" height="100%">
                <TaskView {...dummyTask}/>
                <TaskView {...dummyTask}/>
                <TaskView {...dummyTask}/>
                <TaskView {...dummyTask}/>
            </Flex>
        </Box>
    );
};

export default Plan;
