import {Box, GridItem, Grid} from "@chakra-ui/react";
import Header from "@/components/header/Header.tsx";
import Menu from "@/components/sidemenu/Menu.tsx";
import CreatorMenu from "@/components/popover/CreatorMenu/CreatorMenu.tsx";
import {checkAuthStateQuery} from "@/queries/CheckAuthStateQuery.tsx";
import {useQuery} from "@tanstack/react-query";
import type {Task as TaskType} from "@/types/Task.ts";
import {useEffect} from "react";
import type {FetchError} from "@/types/FetchError.ts";
import {useNavigate} from "react-router-dom";

const PlansPage = () => {
    const navigate = useNavigate();

    const {error} = useQuery<TaskType[]>(checkAuthStateQuery());

    useEffect(() => {
        if (error) {
            const fetchError = error as FetchError
            if (fetchError.status === 401) {
                navigate("/auth/log-in");
            } else {
                console.error(fetchError);
            }
        }
    }, [error]);

    return (
        <Box w="100vw" h="100vh" bg="base.300" fontSize="17px" textStyle="body">
            <Grid
                templateRows={{
                    base: "auto 1fr 1fr auto", // 4 rows
                    sm: "auto 1fr 1fr auto", // 4 rows
                    md: "auto 1fr", // 2 rows
                }}
                templateColumns={{
                    base: "repeat(1, 1fr)", // 1 column
                    sm: "repeat(1, 1fr)", // 1 column
                    md: "repeat(10, 1fr)", // 7 columns
                }}
                h="100%"
                gap={1}>
                {/* header */}
                <GridItem h="3em" colSpan={10} rowSpan={1} bg="base.200">
                    <Header/>
                </GridItem>

                {/* menu */}
                <GridItem colSpan={1} bg="base.200" style={styles.gridSection} gridRow={{base: 4, sm: 4, md: 2}}>
                    <Menu/>
                </GridItem>

                {/* minHeight is for scrolling */}
                <GridItem minHeight="0px" colSpan={5} bg="base.200" style={styles.gridSection}
                          order={{base: 2, md: 1}}>
                    lorem ipsum
                </GridItem>

                <CreatorMenu/>
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
