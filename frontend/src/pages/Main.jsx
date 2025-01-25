import { useState } from "react";
import { Box, Button, Input, HStack, GridItem, Grid, Flex } from "@chakra-ui/react";
import TaskBubble from "../components/TaskBubble";
import TaskBubbleExpanded from "../components/TaskBubbleExpanded";
import Header from "../components/Header";
import { useTaskContext } from "../TaskContext.jsx"; // Import the context

function Main() {
  const [taskList, setTasks] = useState([
    { name: "Learn", date: "2025-01-25", key: "1" },
    { name: "Walk", date: "2025-02-01", key: "2" },
    { name: "Drink", date: "2025-02-05", key: "3" },
  ]);
  const [longtermList, setLongtermList] = useState([
    { name: "Achieve", key: "10" },
    { name: "Win", key: "20" },
    { name: "Reach", key: "30" },
  ]);

  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");

  const handleAddTask = () => {
    if (newTaskName) {
      const newTask = {
        name: newTaskName,
        date: newTaskDate,
      };
      if (newTaskDate) setTasks([...taskList, newTask]);
      else setLongtermList([...longtermList, newTask]);

      setNewTaskName("");
      setNewTaskDate("");
    }
  };

  const handleDeleteTask = (taskToDelete) => {
    setTasks(taskList.filter((task) => task.key !== taskToDelete.key));
  };

  const { expandedTaskId, handleExpandTask } = useTaskContext();

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
              <div key={task.key}>
                {expandedTaskId === task.key ? (
                  <TaskBubbleExpanded task={task} handleDeleteTask={handleDeleteTask} />
                ) : (
                  <TaskBubble task={task} handleDeleteTask={handleDeleteTask} />
                )}
              </div>
            ))}
          </Flex>
        </GridItem>

        {/* long term tasks */}
        <GridItem colSpan={2} bg="#dcdcdc">
          <Flex direction="column" height="100%" justifyContent="flex-start">
            {longtermList.map((task) => (
              <TaskBubble key={task.key} task={task} handleDeleteTask={handleDeleteTask} />
            ))}
          </Flex>
        </GridItem>

        {/* controls */}
        <GridItem h="4em" colSpan={7} rowSpan={1} bg="#dcdcdc">
          <Flex justify="center" p="1">
            <HStack marginTop="auto">
              <Input value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} placeholder="Task name" />
              <Input type="date" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} placeholder="Task date" />
              <Button bg="green" onClick={handleAddTask}>
                Add Task
              </Button>
            </HStack>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default Main;
