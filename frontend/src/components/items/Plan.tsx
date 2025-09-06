import {Box, Flex, Text, ProgressCircle, Spacer} from "@chakra-ui/react";
import {newTask} from "@/types/Task.ts";
import TaskView from "@/components/items/TaskView.tsx";
import type {Plan as PlanType} from "@/types/Plan.ts";
import {useSetAtom} from "jotai";
import {existingPlanForEdit, showPlanCreator} from "@/global/atoms.ts";

const dummyTask = newTask;
dummyTask.data.date = String(new Date());
dummyTask.data.name = "Some name";

const Plan = (plan: PlanType) => {

    const setEditPlan = useSetAtom(existingPlanForEdit);

    const setShowDialog = useSetAtom(showPlanCreator);

    const handleClick = () => {
        setEditPlan(plan);
        setShowDialog(true);
    };

    return (
        <Box
            p="2"
            bg="base.100"
            color="black"
            borderRadius="md"
            boxShadow="sm"
            mb="3.5"
            position="relative"
            cursor="button"
            onClick={handleClick}
        >
            <Flex align="center" justifyContent="space-between">
                <Text>{plan.data.name}</Text>
                <Spacer/>
                <ProgressCircle.Root size={"sm"} value={75}>
                    <ProgressCircle.Circle>
                        <ProgressCircle.Track/>
                        <ProgressCircle.Range strokeLinecap="round"/>
                    </ProgressCircle.Circle>
                </ProgressCircle.Root>
            </Flex>
            <Text>{plan.data.description}</Text>
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
