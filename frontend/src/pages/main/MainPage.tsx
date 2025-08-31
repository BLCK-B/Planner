import {Box, GridItem, Grid} from "@chakra-ui/react";
import Header from "@/components/header/Header.tsx";
import MainList from "@/components/lists/MainList.tsx";
import Menu from "@/components/sidemenu/Menu.tsx";
import CreatorMenu from "@/components/popover/CreatorMenu/CreatorMenu.tsx";

const MainPage = () => {
    return (
        <Box w="100vw" h="100vh" bg="base.300" fontSize="17px" textStyle="body">
            <Grid
                templateColumns={{
                    base: "repeat(1, 1fr)", // 1 column
                    sm: "repeat(1, 1fr)", // 1 column
                    md: "repeat(10, 1fr)", // 7 columns
                }}
                h="100%"
                gap={1}
            >
                {/* header */}
                <GridItem colSpan={10} rowSpan={1} bg="base.200">
                    <Header/>
                </GridItem>

                {/* page menu */}
                <GridItem colSpan={1} bg="base.200" style={styles.gridSection} gridRow={{base: 4, sm: 4, md: 2}}>
                    <Menu/>
                </GridItem>

                {/* minHeight is for scrolling */}
                <GridItem rowSpan={9} minHeight="0px" colSpan={9} bg="base.200" style={styles.gridSection}>
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
