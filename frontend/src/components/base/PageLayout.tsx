import {Box, GridItem, Grid} from "@chakra-ui/react";
import Menu from "@/components/sidemenu/Menu.tsx";
import * as React from "react";
import TagCreator from "@/components/popover/CreatorMenu/TagCreator.tsx";
import ErrorModal from "@/components/popover/ErrorModal.tsx";

type Props = {
    header: React.ReactNode;
    content: React.ReactNode;
    popover: React.ReactNode;
};

const PageLayout = ({header, content, popover}: Props) => {
    return (
        <Box w="100vw" h="100dvh" bg="primary.darker" fontSize="17px" textStyle="body">
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
                    {header}
                </GridItem>

                {/* page menu */}
                <GridItem
                    colSpan={{base: 10, sm: 10, md: 1}}
                    gridRow={{base: 3, sm: 3, md: 2}}
                >
                    <Menu/>
                </GridItem>

                {/* content */}
                <GridItem
                    colSpan={{base: 10, sm: 10, md: 9}} colStart={{base: 1, sm: 1, md: 2}}
                    rowSpan={{base: 1, sm: 1, md: 9}} rowStart={{base: 2, sm: 2, md: 2}}
                    minHeight="0px"
                    bg="primary"
                    style={styles.gridSection}
                >
                    {content}
                </GridItem>

                {/* popover */}
                {popover}
                {/* globally accessible */}
                {/* todo: temporarily placed */}
                <TagCreator/>
                <ErrorModal/>
            </Grid>
        </Box>
    );
};

export default PageLayout;

const styles = {
    gridSection: {
        borderRadius: "5px",
    },
};
