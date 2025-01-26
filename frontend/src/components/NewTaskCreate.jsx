import { useState } from "react";
import { HStack, Input, Button, Flex } from "@chakra-ui/react";
import { useTaskContext } from "../TaskContext.jsx";

const NewTaskCreate = () => {
  const { handleAddTask } = useTaskContext();

  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");

  const handleClickAdd = () => {
    if (newTaskName) {
      if (newTaskDate) handleAddTask({ name: newTaskName, date: newTaskDate, type: "deadline" });
      else handleAddTask({ name: newTaskName, date: newTaskDate, type: "long-term" });
      setNewTaskName("");
      setNewTaskDate("");
    }
  };

  return (
    <Flex justify="center" p="1">
      <HStack marginTop="auto">
        <Input value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} placeholder="Task name" />
        <Input type="date" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} placeholder="Task date" />
        <Button bg="green" onClick={handleClickAdd}>
          Create Task
        </Button>
      </HStack>
    </Flex>
  );
};

export default NewTaskCreate;
