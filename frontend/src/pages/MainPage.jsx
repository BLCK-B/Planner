import { Box, GridItem, Grid, Stack } from "@chakra-ui/react";
import Header from "../components/Header.jsx";
import NewTaskCreate from "../components/NewTaskCreate.jsx";
import TaskList from "../components/TaskList.jsx";
import Menu from "../components/Menu.jsx";
import "../styles/App.css";

function MainPage() {
  return (
    <Box w="100vw" h="100vh" bg="base.300">
      <Grid
        templateRows={{
          base: "auto auto auto auto", // 4 rows
          sm: "auto auto auto auto", // 4 rows
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
        <GridItem h="4em" colSpan={7} rowSpan={1} bg="base.200">
          <Header />
        </GridItem>

        {/* side menu */}
        <GridItem colSpan={1} bg="base.200" className="gridSection" hideBelow="md">
          <Menu />
        </GridItem>
        {/* bottom menu */}
        <GridItem colSpan={1} bg="base.200" className="gridSection" hideFrom="md" gridRow={{ base: 4, sm: 4 }}>
          <Menu />
        </GridItem>

        {/* deadline tasks */}
        <GridItem colSpan={4} bg="base.200" minHeight="300px" className="gridSection" order={{ base: 2, md: 1 }}>
          <NewTaskCreate taskType="deadline" />
          <TaskList taskType="deadline" />
        </GridItem>

        {/* long term tasks */}
        <GridItem
          colSpan={{
            base: 4,
            sm: 4,
            md: 2,
          }}
          order={{ base: 1, md: 2 }}
          bg="base.200"
          minHeight="300px"
          className="gridSection">
          <NewTaskCreate taskType="long-term" />
          <TaskList taskType="long-term" />
        </GridItem>
      </Grid>
    </Box>
  );
}

export default MainPage;
