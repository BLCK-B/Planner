import {Grid} from "@chakra-ui/react";
import Plan from '@/components/items/Plan.tsx'
import {useQuery} from "@tanstack/react-query";
import type {Plan as PlanType} from "@/types/Plan";
import loadPlansQuery from "@/queries/LoadPlansQuery.tsx";

const PlansGrid = () => {

    const {data} = useQuery<PlanType[]>(loadPlansQuery());

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <Grid templateColumns={{
            base: "1fr", // 1 column
            sm: "1fr", // 1 column
            md: "repeat(2, 1fr)", // 2 columns
        }} gap="6" p="25px" style={{overflowY: "scroll", scrollbarWidth: "none"}} height="100%">
            {data.map((plan) => (
                <Plan key={plan.itemID} {...plan} />
            ))}
        </Grid>
    );
};

export default PlansGrid;