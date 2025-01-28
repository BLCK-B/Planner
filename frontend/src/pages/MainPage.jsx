import { Box, GridItem, Grid, Heading, Center, Flex } from "@chakra-ui/react";
import Header from "../components/Header.jsx";
import NewTaskCreate from "../components/NewTaskCreate.jsx";
import TaskList from "../components/TaskList.jsx";
import Menu from "../components/Menu.jsx";
import "../styles/App.css";

function MainPage() {
  return (
    <Box w="100vw" h="100vh" bg="base.300">
      <Grid templateRows="auto 1fr" templateColumns="repeat(7, 1fr)" h="100%" gap={1}>
        {/* header */}
        <GridItem h="4em" colSpan={7} rowSpan={1} bg="base.200">
          <Header />
        </GridItem>

        {/* controls */}
        <GridItem colSpan={1} bg="base.200" className="gridSection">
          <Menu />
        </GridItem>

        {/* deadline tasks */}
        <GridItem colSpan={4} bg="base.200" minHeight="300px" className="gridSection">
          <NewTaskCreate taskType="deadline" />
          <TaskList taskType="deadline" />
        </GridItem>

        {/* long term tasks */}
        <GridItem colSpan={2} bg="base.200" minHeight="300px" className="gridSection">
          <NewTaskCreate taskType="long-term" />
          <TaskList taskType="long-term" />
        </GridItem>
      </Grid>
    </Box>
  );
}

export default MainPage;
