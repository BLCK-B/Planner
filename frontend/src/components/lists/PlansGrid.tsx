import {Grid} from "@chakra-ui/react";
import Plan from '@/components/items/Plan.tsx'

const PlansGrid = () => {
    return (
        <Grid templateColumns={{
            base: "1fr", // 1 column
            sm: "1fr", // 1 column
            md: "repeat(2, 1fr)", // 2 columns
        }} gap="6" p="25px" style={{overflowY: "scroll", scrollbarWidth: "none"}} height="100%">
            <Plan></Plan>
            <Plan></Plan>
            <Plan></Plan>
            <Plan></Plan>
            <Plan></Plan>
            <Plan></Plan>
            <Plan></Plan>
        </Grid>
    );
};

export default PlansGrid;