import { Box, GridItem, Grid } from "@chakra-ui/react";
import Header from "../components/Header.jsx";
import NewTaskCreate from "../components/NewTaskCreate.jsx";
import TaskList from "../components/TaskList.jsx";

function MainPage() {
  return (
    <Box w="100vw" h="100vh" bg="base.100">
      <Grid templateRows="auto 1fr" templateColumns="repeat(7, 1fr)" h="100%">
        {/* header */}
        <GridItem h="4em" colSpan={7} rowSpan={1} className="header">
          <Header />
        </GridItem>

        <GridItem colSpan={1} bg="base.200"></GridItem>

        {/* deadline tasks */}
        <GridItem colSpan={4} bg="base.200" minHeight="300px">
          <TaskList taskType={"deadline"} />
        </GridItem>

        {/* long term tasks */}
        <GridItem colSpan={2} bg="base.200" minHeight="300px">
          <TaskList taskType={"long-term"} />
        </GridItem>

        {/* controls */}
        <GridItem h="4em" colSpan={7} rowSpan={1} bg="base.200">
          <NewTaskCreate />
        </GridItem>
      </Grid>
    </Box>
  );
}

export default MainPage;
