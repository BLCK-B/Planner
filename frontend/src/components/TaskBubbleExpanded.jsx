import { useState } from "react";
import { Box, Button, Flex, Input } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTaskContext } from "../TaskContext.jsx";

const TaskBubble = ({ task }) => {
  const { handleCollapseTask, handleDeleteTask } = useTaskContext();

  const [taskName, setTaskName] = useState(task.name);
  const [taskDate, setTaskDate] = useState(task.date);
  const handleNameChange = (e) => {
    setTaskName(e.target.value);
  };
  const handleDateChange = (e) => {
    setTaskDate(e.target.value);
  };

  const handleClick = () => {
    // handleCollapseTask();
  };

  const handleConfirmClick = (e) => {
    e.stopPropagation();
    console.log("confirm");
  };

  return (
    <Box p="2" bg="white" color="black" borderRadius="md" boxShadow="sm" mb="4" w="50%" onClick={handleClick} cursor="button">
      <Flex gap="6" align="center" justifyContent="start">
        <Input w="40%" type="date" value={task.date} placeholder={task.date} onChange={handleDateChange} />
        <Input w="40%" value={taskName} placeholder={taskDate} onChange={handleNameChange} />
      </Flex>
      <Flex gap="6" align="center" justifyContent="center">
        <Button bg="green" p="0" onClick={handleConfirmClick}>
          Confirm
        </Button>
        <Button bg="red" p="0" onClick={() => handleDeleteTask(task)}>
          Delete
        </Button>
      </Flex>
    </Box>
  );
};

TaskBubble.propTypes = {
  task: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.string,
  }).isRequired,
};

export default TaskBubble;
