import {Grid} from "@chakra-ui/react";
import Plan from '@/components/items/Plan.tsx'
import {useQuery} from "@tanstack/react-query";
import type {PlanType, PlanWithTasks} from "@/types/PlanType.ts";
import loadPlansQuery from "@/queries/LoadPlansQuery.tsx";
import type {Task as TaskType} from "@/types/Task.ts";
import loadTasksAssignedToPlansQuery from "@/queries/LoadTasksAssignedToPlansQuery.tsx";

const PlansGrid = () => {

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
        <Grid
            templateColumns={{
                base: "1fr", // 1 column
                sm: "1fr", // 1 column
                md: "repeat(2, 1fr)", // 2 columns
            }}
            w={{
                base: "100%",
                sm: "95%",
            }}
            gap="6" p="25px" style={{overflowY: "scroll", scrollbarWidth: "none"}} height="100%">
            {plansWithTasks.map((planWithTasks) => (
                <Plan key={planWithTasks.planID} {...planWithTasks} />
            ))}
        </Grid>
    );
};

export default PlansGrid;