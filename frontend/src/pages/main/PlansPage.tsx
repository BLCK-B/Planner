import {Box, GridItem, Grid} from "@chakra-ui/react";
import Menu from "@/components/sidemenu/Menu.tsx";
import PlansGrid from "@/components/lists/PlansGrid.tsx";
import HeaderPlansPage from "@/components/header/HeaderPlansPage.tsx";
import PlanCreator from "@/components/popover/CreatorMenu/PlanCreator.tsx";

const PlansPage = () => {
    return (
        <Box w="100vw" h="100vh" bg="primary.darker" fontSize="17px" textStyle="body">
            <Grid
                templateColumns={{
                    base: "1fr", // 1 column
                    sm: "1fr", // 1 column
                    md: "repeat(10, 1fr)", // 10 columns
                }}
                h="100%"
                gap={1}
            >
                {/* header */}
                <GridItem colSpan={10} rowSpan={1}>
                    <HeaderPlansPage/>
                </GridItem>

                {/* page menu */}
                <GridItem
                    colSpan={{base: 10, sm: 10, md: 1}}
                    bg="primary.base"
                    style={styles.gridSection}
                    gridRow={{base: 3, sm: 3, md: 2}}
                >
                    <Menu/>
                </GridItem>

                {/* content */}
                <GridItem
                    rowSpan={{base: 1, sm: 1, md: 9}}
                    colSpan={{base: 10, sm: 10, md: 9}}
                    minHeight="0px" // minHeight is for scrolling
                    bg="primary.base"
                    style={styles.gridSection}
                >
                    <PlansGrid/>
                </GridItem>

                {/* popover */}
                <PlanCreator/>
            </Grid>
        </Box>
    );
};

export default PlansPage;

const styles = {
    gridSection: {
        borderRadius: "5px",
    },
};
