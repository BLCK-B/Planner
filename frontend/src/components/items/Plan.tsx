import {Box, Flex, Text, ProgressCircle, Spacer} from "@chakra-ui/react";
import type {PlanWithTasks} from "@/types/PlanType.ts";
import {useSetAtom} from "jotai";
import {existingPlanForEdit, showPlanCreator} from "@/global/atoms.ts";
import TaskView from "@/components/items/TaskView.tsx";

const Plan = (plan: PlanWithTasks) => {

    const setEditPlan = useSetAtom(existingPlanForEdit);

    const setShowDialog = useSetAtom(showPlanCreator);

    const handleClick = () => {
        setEditPlan(plan);
        setShowDialog(true);
    };

    return (
        <Box
            h="20rem"
            p="2"
            bg="primary.base"
            color="primary.contrast"
            borderRadius="md"
            boxShadow="sm"
            mb="3.5"
            position="relative"
            cursor="button"
            onClick={handleClick}
            border={"2px solid " + plan.data.color}
        >
            <Flex align="center" justifyContent="space-between">
                <Text fontWeight="bold">{plan.data.name}</Text>
                <Spacer/>
                <ProgressCircle.Root size={"sm"} value={75}>
                    <ProgressCircle.Circle>
                        <ProgressCircle.Track/>
                        <ProgressCircle.Range stroke={plan.data.color}/>
                    </ProgressCircle.Circle>
                </ProgressCircle.Root>
            </Flex>
            <Text>{plan.data.description}</Text>
            <Flex direction="column" height="85%" overflow="scroll">
                {plan.tasks.map(task => (
                    <TaskView key={task.itemID} {...task} />
                ))}
            </Flex>
        </Box>
    );
};

export default Plan;
