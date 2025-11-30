import {Box, Flex} from "@chakra-ui/react";
import Plan from '@/components/items/Plan.tsx'
import {useQuery} from "@tanstack/react-query";
import type {PlanType, PlanWithTasks} from "@/types/PlanType.ts";
import loadPlansQuery from "@/queries/LoadPlansQuery.tsx";
import type {Task as TaskType} from "@/types/Task.ts";
import loadTasksAssignedToPlansQuery from "@/queries/LoadTasksAssignedToPlansQuery.tsx";

const PlansList = () => {

    const {data: plans} = useQuery<PlanType[]>(loadPlansQuery());

    const {data: tasksWithPlans} = useQuery<TaskType[]>(loadTasksAssignedToPlansQuery())

    if (!plans || !tasksWithPlans) {
        return <div>Loading...</div>;
    }

    const plansWithTasks: PlanWithTasks[] = plans.map(plan => ({
        ...plan,
        tasks: tasksWithPlans.filter(task => task.data.plan?.planID === plan.planID)
    }));

    return (
        <Flex direction="column" height="100%" style={{overflowY: "scroll", scrollbarWidth: "none"}}>
            <Box overflowY="scroll" scrollbarWidth="none">
                <Box w={{base: "92%", sm: "90%", md: "65%"}} mx="auto" position="relative" top="50px"
                     paddingBottom="50px">
                    {plansWithTasks.map((planWithTasks) => (
                        <Plan key={planWithTasks.planID} {...planWithTasks} />
                    ))}
                </Box>
            </Box>
        </Flex>
    );
};

export default PlansList;