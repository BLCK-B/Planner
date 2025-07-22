import {Box, GridItem, Grid} from "@chakra-ui/react";
import Header from "../components/layout/Header.tsx";
import NewTaskCreate from "../components/items/NewTaskCreate.tsx";
import ItemsWithDate from "../components/lists/ItemsWithDate.tsx";
import ItemsWithoutDate from "../components/lists/ItemsWithoutDate.tsx";
import Menu from "../components/layout/Menu.tsx";
import CreatorMenu from "../components/functional/CreatorMenu.tsx";

function MainPage() {
    return (
        <Box w="100vw" h="100vh" bg="base.300" fontSize="17px">
            <Grid
                templateRows={{
                    base: "auto 1fr 1fr auto", // 4 rows
                    sm: "auto 1fr 1fr auto", // 4 rows
                    md: "auto 1fr", // 2 rows
                }}
                templateColumns={{
                    base: "repeat(1, 1fr)", // 1 column
                    sm: "repeat(1, 1fr)", // 1 column
                    md: "repeat(7, 1fr)", // 7 columns
                }}
                h="100%"
                gap={1}>
                {/* header */}
                <GridItem h="3em" colSpan={7} rowSpan={1} bg="base.200">
                    <Header/>
                </GridItem>

                {/* menu */}
                <GridItem colSpan={1} bg="base.200" style={styles.gridSection} gridRow={{base: 4, sm: 4, md: 2}}>
                    <Menu/>
                </GridItem>

                {/* minHeight is for scrolling */}
                <GridItem minHeight="0px" colSpan={4} bg="base.200" style={styles.gridSection} order={{base: 2, md: 1}}>
                    {/*<NewTaskCreate taskType="with-date" />*/}
                    <ItemsWithDate/>
                </GridItem>

                <GridItem
                    colSpan={{
                        base: 4,
                        sm: 4,
                        md: 2,
                    }}
                    order={{base: 1, md: 2}}
                    bg="base.200"
                    minHeight="300px"
                    style={styles.gridSection}>
                    {/*<NewTaskCreate taskType="without-date" />*/}
                    <ItemsWithoutDate/>
                </GridItem>
                
                <CreatorMenu/>
            </Grid>
        </Box>
    );
}

export default MainPage;

const styles = {
    gridSection: {
        borderRadius: "5px",
    },
};
