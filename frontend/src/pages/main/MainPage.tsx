import {Box, GridItem, Grid} from "@chakra-ui/react";
import MainList from "@/components/lists/MainList.tsx";
import Menu from "@/components/sidemenu/Menu.tsx";
import CreatorMenu from "@/components/popover/CreatorMenu/CreatorMenu.tsx";
import HeaderMainPage from "@/components/header/HeaderMainPage.tsx";

const MainPage = () => {
    return (
        <Box w="100vw" h="100vh" bg="base.300" fontSize="17px" textStyle="body">
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
                    <HeaderMainPage/>
                </GridItem>

                {/* page menu */}
                <GridItem
                    colSpan={{base: 10, sm: 10, md: 1}}
                    bg="base.200"
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
                    bg="base.200"
                    style={styles.gridSection}
                >
                    <MainList/>
                </GridItem>

                {/* popover */}
                <CreatorMenu/>

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
