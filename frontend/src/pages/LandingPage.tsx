import {Box, GridItem, Grid, Text} from "@chakra-ui/react";
import Header from "@/components/layout/Header.tsx";

function LandingPage() {
    return (
        <Box w="100vw" h="100vh" bg="base.100">
            <Grid templateRows="auto 1fr" templateColumns="repeat(7, 1fr)" gap={2} h="100%">
                {/* header */}
                <GridItem h="4em" colSpan={7} rowSpan={1} bg="#dcdcdc">
                    <Header/>
                </GridItem>

                <GridItem colSpan={1} bg="#dcdcdc"></GridItem>

                <GridItem colSpan={5} bg="#dcdcdc">
                    <Text color="black">Sign up now!</Text>
                </GridItem>

                <GridItem colSpan={1} bg="#dcdcdc"></GridItem>
            </Grid>
        </Box>
    );
}

export default LandingPage;
