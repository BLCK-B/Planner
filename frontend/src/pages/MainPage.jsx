import { useState } from "react";
import { Box, Button, Input, HStack, GridItem, Grid, Flex } from "@chakra-ui/react";
import TaskBubble from "../components/TaskBubble.jsx";
import TaskBubbleExpanded from "../components/TaskBubbleExpanded.jsx";
import Header from "../components/Header.jsx";
import { useTaskContext } from "../TaskContext.jsx";

function MainPage() {
  const { taskList, longtermList, handleUpdateTask, expandedTaskId, handleExpandTask, handleDeleteTask, handleAddTask } =
    useTaskContext();

  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");

  const handleClickAdd = () => {
    if (newTaskName) {
      handleAddTask({ name: newTaskName, date: newTaskDate });
      setNewTaskName("");
      setNewTaskDate("");
    }
  };

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
          <Flex justify="center" p="1">
            <HStack marginTop="auto">
              <Input value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} placeholder="Task name" />
              <Input type="date" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} placeholder="Task date" />
              <Button bg="green" onClick={handleClickAdd}>
                Add Task
              </Button>
            </HStack>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default MainPage;
