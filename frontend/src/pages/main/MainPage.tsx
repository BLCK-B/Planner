import {Box, GridItem, Grid} from "@chakra-ui/react";
import MainList from "@/components/lists/MainList.tsx";
import Menu from "@/components/sidemenu/Menu.tsx";
import TaskCreator from "@/components/popover/CreatorMenu/TaskCreator.tsx";
import HeaderMainPage from "@/components/header/HeaderMainPage.tsx";

const MainPage = () => {
    return (
        <Box w="100vw" h="100vh" bg="primary.darker" fontSize="17px" textStyle="body">
            <Grid
                templateColumns={{
                    base: "1fr", // 1 column
                    sm: "1fr", // 1 column
                    md: "repeat(10, 1fr)", // 10 columns
                }}
                templateRows={{
                    base: "auto 1fr auto",
                    sm: "auto 1fr auto",
                    md: "auto repeat(9, 1fr)" // 9 rows header on large screen
                }}
                h="100%"
                gap={1}
            >
                {/* header */}
                <GridItem
                    colSpan={{base: 10, sm: 10, md: 9}} colStart={{base: 1, sm: 1, md: 2}}
                    rowSpan={1} rowStart={1}
                >
                    <HeaderMainPage/>
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
                    colSpan={{base: 10, sm: 10, md: 9}} colStart={{base: 1, sm: 1, md: 2}}
                    rowSpan={{base: 1, sm: 1, md: 9}} rowStart={{base: 2, sm: 2, md: 2}}
                    minHeight="0px"
                    bg="primary.base"
                    style={styles.gridSection}
                >
                    <MainList/>
                </GridItem>

                {/* popover */}
                <TaskCreator/>
            </Grid>
        </Box>
    );
};

export default MainPage;

const styles = {
    gridSection: {
        borderRadius: "5px",
    },
};
