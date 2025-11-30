import {Box, Flex, Text, Spacer} from "@chakra-ui/react";
import type {PlanWithTasks} from "@/types/PlanType.ts";
import {useSetAtom} from "jotai";
import {existingPlanForEdit, showPlanCreator} from "@/global/atoms.ts";
import TaskView from "@/components/items/TaskView.tsx";
import CompletionProgress from "@/components/base/CompletionProgress.tsx";
import {sortFutureTasks, sortGoals} from "@/functions/Sorting.tsx";
import {isDatePast} from "@/functions/Dates.tsx";
import type {Task as TaskType} from "@/types/Task.ts";

const Plan = (plan: PlanWithTasks) => {

    const setEditPlan = useSetAtom(existingPlanForEdit);

    const setShowDialog = useSetAtom(showPlanCreator);

    const handleClick = () => {
        setEditPlan(plan);
        setShowDialog(true);
    };

    const itemList = plan.tasks;

    const tasks = itemList.filter((task) => task.data.itemType === "Task");

    const goals = itemList
        .filter((goal) => goal.data.itemType === "Goal")
        .filter((goal) => !goal.data.completed)
        .sort(sortGoals);

    const futureTasks = tasks
        .filter((task) => !task.data.completed)
        .filter((task) => !isDatePast(task.data.date))
        .sort(sortFutureTasks);

    const overdueTasks = tasks
        .filter((task) => !task.data.completed)
        .filter((task) => isDatePast(task.data.date))
        .sort(sortFutureTasks);

    const renderItems = (items: TaskType[]) => {
        if (items.length === 0) return;
        return (
            <Box position="relative" mt="5px">
                {items.map((item) => (
                    <Box key={item.itemID} position="relative" mb="2">
                        <TaskView {...item} />
                    </Box>
                ))}
            </Box>
        );
    };

    const countCompletedTasks = () => {
        return plan.tasks
            .filter((task) => task.data.completed)
            .length;
    };

    return (
        <Box
            p="15px"
            bg={`rgba${plan.data.color.slice(3, -1)}, 0.1)`}
            color="primary.contrast"
            borderRadius="md"
            boxShadow="sm"
            mb="6"
            position="relative"
            cursor="button"
            onClick={handleClick}
            border={"2px solid " + `rgba${plan.data.color.slice(3, -1)}, 0.4)`}
            _hover={{border: "2px solid " + `rgba${plan.data.color.slice(3, -1)}, 0.6)`}}
            transition="0.1s ease-in-out"
        >
            <Flex align="center" justifyContent="space-between">
                <Text fontWeight="bold">{plan.data.name}</Text>
                <Spacer/>
                <CompletionProgress total={plan.tasks.length} completed={countCompletedTasks()}
                                    color={plan.data.color}/>
            </Flex>
            <Text>{plan.data.description}</Text>
            <Flex direction="column" overflow="scroll" p="10px" mt="15px">
                {renderItems(futureTasks)}

                {renderItems(overdueTasks)}

                {renderItems(goals)}
            </Flex>
        </Box>
    );
};

export default Plan;
