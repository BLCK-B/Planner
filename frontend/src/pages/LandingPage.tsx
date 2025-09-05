import {Box, GridItem, Grid, Text} from "@chakra-ui/react";
import HeaderLandingPage from "@/components/header/HeaderLandingPage.tsx";

const LandingPage = () => {
    return (
        <Box w="100vw" h="100vh" bg="base.100" textStyle="body">
            <Grid templateRows="auto 1fr" templateColumns="repeat(7, 1fr)" h="100%">

                <GridItem colSpan={10} rowSpan={1}>
                    <HeaderLandingPage/>
                </GridItem>

                <GridItem colSpan={1} bg="base.200"></GridItem>

                <GridItem colSpan={5} bg="base.200">
                    <Text color="black">Sign up now!</Text>
                </GridItem>

                <GridItem colSpan={1} bg="base.200"></GridItem>
            </Grid>
        </Box>
    );
};

export default LandingPage;
