import { useState } from "react";
import { Box, Flex, Input, Tabs, Show } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTaskContext } from "../TaskContext.jsx";
import { FaTrashAlt, FaCheckSquare } from "react-icons/fa";
import "../styles/App.css";

const TaskBubble = ({ task }) => {
  const { handleCollapseTask, handleDeleteTask, handleUpdateTask } = useTaskContext();

  const [taskName, setTaskName] = useState(task.name);
  const [taskDate, setTaskDate] = useState(task.date);
  const [taskType, setTaskType] = useState(task.type);
  const handleNameChange = (e) => {
    setTaskName(e.target.value);
  };
  const handleDateChange = (e) => {
    setTaskDate(e.target.value);
  };
  const handleTypeChange = (type) => {
    setTaskType(type);
  };

  const handleClick = () => {
    // handleCollapseTask();
  };

  const handleConfirmClick = (e) => {
    e.stopPropagation();
    handleUpdateTask(task.key, { name: taskName, date: taskDate, type: taskType });
    handleCollapseTask();
    console.log("confirm");
  };

  return (
    <Box p="2" bg="base.100" color="black" borderRadius="md" boxShadow="sm" mb="4" onClick={handleClick} cursor="button">
      {/* inputs */}
      <Flex gap="6" align="center" justifyContent="start">
        <Show when={taskType === "deadline"}>
          <Input w="40%" type="date" value={taskDate} placeholder={taskDate} onChange={handleDateChange} />
        </Show>
        <Input w="40%" value={taskName} placeholder={taskName} onChange={handleNameChange} />
      </Flex>
      {/* buttons */}
      <Flex gap="6" align="center" justifyContent="center">
        <Tabs.Root defaultValue="members" variant="plain">
          <Tabs.List bg="bg.muted" rounded="l3">
            <Tabs.Trigger value="long-term" onClick={() => handleTypeChange("long-term")}>
              long-term
            </Tabs.Trigger>
            <Tabs.Trigger value="deadline" onClick={() => handleTypeChange("deadline")}>
              deadline
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <FaCheckSquare alt="Confirm" className="confirmIcon" onClick={handleConfirmClick} />
        <FaTrashAlt alt="Delete" className="deleteIcon" onClick={() => handleDeleteTask(task)} />
      </Flex>
    </Box>
  );
};

TaskBubble.propTypes = {
  task: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.string,
    type: PropTypes.string,
    key: PropTypes.number.isRequired,
  }).isRequired,
};

export default TaskBubble;
