import { useState } from "react";
import { Box, Flex, Input, Show, Textarea } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTaskContext } from "../TaskContext.jsx";
import { FaTrashAlt, FaCheckSquare } from "react-icons/fa";
import "../styles/App.css";

const TaskBubble = ({ task }) => {
  const { handleCollapseTask, handleDeleteTask, handleUpdateTask } = useTaskContext();

  const [taskName, setTaskName] = useState(task.name);
  const [taskDate, setTaskDate] = useState(task.date);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const handleNameChange = (e) => {
    setTaskName(e.target.value);
  };
  const handleDateChange = (e) => {
    setTaskDate(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    setTaskDescription(e.target.value);
  };

  const handleClick = () => {
    // handleCollapseTask();
  };

  const handleConfirmClick = (e) => {
    e.stopPropagation();
    handleUpdateTask(task.key, { name: taskName, date: taskDate, type: task.type, description: taskDescription });
    handleCollapseTask();
    console.log("confirm");
  };

  return (
    <Box p="2" bg="base.100" color="black" borderRadius="md" boxShadow="sm" mb="4" onClick={handleClick} cursor="button">
      {/* inputs */}
      <Flex gap="6" align="center" justifyContent="start">
        <Show when={task.type === "deadline"}>
          <Input className="taskEditField" variant="subtle" type="date" value={taskDate} onChange={handleDateChange} />
        </Show>
        <Input
          className="taskEditField"
          variant="subtle"
          value={taskName}
          placeholder="Long-term goal"
          onChange={handleNameChange}
        />
      </Flex>
      <Show when={task.type === "long-term"}>
        <Textarea
          className="taskDescriptionField"
          variant="subtle"
          placeholder="Description"
          resize="vertical"
          autoresize
          value={taskDescription}
          onChange={handleDescriptionChange}
        />
      </Show>
      {/* buttons */}
      <Flex gap="6" align="center" justifyContent="center">
        <FaCheckSquare alt="Confirm" className="confirmIcon" onClick={handleConfirmClick} />
        <FaTrashAlt alt="Delete" className="deleteIcon" onClick={() => handleDeleteTask(task)} />
      </Flex>
    </Box>
  );
};

TaskBubble.propTypes = {
  task: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    key: PropTypes.number.isRequired,
    date: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default TaskBubble;
