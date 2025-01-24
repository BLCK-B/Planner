import { useState } from "react";
import { Box, Button, Input, HStack, GridItem, Grid, VStack } from "@chakra-ui/react";
import TaskBubble from "./components/TaskBubble";

function App() {
  const [taskList, setTasks] = useState([
    { name: "Learn", date: "2025-01-25", key: "1" },
    { name: "Walk", date: "2025-02-01", key: "2" },
    { name: "Drink", date: "2025-02-05", key: "3" },
  ]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");

  const handleAddTask = () => {
    if (newTaskName && newTaskDate) {
      const newTask = {
        name: newTaskName,
        date: newTaskDate,
      };

      setTasks([...taskList, newTask]);

      setNewTaskName("");
      setNewTaskDate("");
    }
  };

  const handleDeleteTask = (taskToDelete) => {
    setTasks(taskList.filter((task) => task.key !== taskToDelete.key));
  };

  return (
    <Box w="100vw" h="100vh" bg="white" p="2em">
      <Grid templateRows="repeat(1, 1fr)" templateColumns="repeat(7, 1fr)" gap={4} h="100%">
        <GridItem colSpan={1} bg="grey">
          <Box h="100%">rowSpan=2</Box>
        </GridItem>

        <GridItem colSpan={4} bg="grey">
          <VStack spacing={4}>
            {/* map tasks -> render task components */}
            {taskList.map((task, index) => (
              <TaskBubble key={index} task={task} handleDeleteTask={handleDeleteTask} />
            ))}
            <HStack>
              <Input value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} placeholder="Task name" />
              <Input type="date" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} placeholder="Task date" />
              <Button onClick={handleAddTask}>Add Task</Button>
            </HStack>
          </VStack>
        </GridItem>

        <GridItem colSpan={2} bg="grey">
          <Box h="100%">colSpan=2</Box>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default App;
