import { Box, GridItem, Grid, Flex } from "@chakra-ui/react";
import TaskBubble from "../components/TaskBubble.jsx";
import TaskBubbleExpanded from "../components/TaskBubbleExpanded.jsx";
import Header from "../components/Header.jsx";
import { useTaskContext } from "../TaskContext.jsx";
import NewTaskCreate from "../components/NewTaskCreate.jsx";

// todo:
// long term edit and delete
// sorting by date
// date formatting
// optional descriptions
function MainPage() {
  const { taskList, longtermList, expandedTaskId } = useTaskContext();

  return (
    <Box w="100vw" h="100vh" bg="white">
      <Grid templateRows="auto 1fr" templateColumns="repeat(7, 1fr)" gap={2} h="100%">
        {/* header */}
        <GridItem h="4em" colSpan={7} rowSpan={1} bg="#dcdcdc">
          <Header />
        </GridItem>

        <GridItem colSpan={1} bg="#dcdcdc"></GridItem>

        {/* deadline tasks */}
        <GridItem colSpan={4} bg="#dcdcdc">
          <Flex direction="column" height="100%" justifyContent="flex-end">
            {taskList.map((task) => (
              <div key={task.key}>{expandedTaskId === task.key ? <TaskBubbleExpanded task={task} /> : <TaskBubble task={task} />}</div>
            ))}
          </Flex>
        </GridItem>

        {/* long term tasks */}
        <GridItem colSpan={2} bg="#dcdcdc">
          <Flex direction="column" height="100%" justifyContent="flex-start">
            {longtermList.map((task) => (
              <TaskBubble key={task.key} task={task} />
            ))}
          </Flex>
        </GridItem>

        {/* controls */}
        <GridItem h="4em" colSpan={7} rowSpan={1} bg="#dcdcdc">
          <NewTaskCreate />
        </GridItem>
      </Grid>
    </Box>
  );
}

export default MainPage;
