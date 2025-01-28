import { useState } from "react";
import { Box, Flex, Input } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTaskContext } from "../TaskContext.jsx";
import { isDatePast } from "../scripts/Dates.jsx";
import { Field } from "@/components/ui/field";
import ButtonConfirm from "./ButtonConfirm.jsx";
import ButtonDelete from "./ButtonDelete.jsx";

const TaskExpanded = ({ task }) => {
  const { handleCollapseTask, handleDeleteTask, handleUpdateTask } = useTaskContext();

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
    handleUpdateTask(task.key, { name: taskName, date: taskDate, type: task.type });
    handleCollapseTask();
    console.log("confirm");
  };

  return (
    <Box
      p="2"
      bg="base.100"
      color="black"
      borderRadius="md"
      boxShadow="sm"
      mb="4"
      onClick={handleClick}
      cursor="button"
      {...(isDatePast(task.date) && { bg: "base.400" })}>
      {/* inputs */}
      <Flex gap="6" align="center" justifyContent="start">
        <Input p="2px" variant="subtle" type="date" value={taskDate} onChange={handleDateChange} />
        <Field invalid={!taskName}>
          <Input p="2px" variant="subtle" value={taskName} placeholder="Task name" onChange={handleNameChange} />
        </Field>
      </Flex>
      {/* buttons */}
      <Flex gap="6" align="center" justifyContent="center">
        <ButtonConfirm disabled={!taskName} onClick={handleConfirmClick} />
        <ButtonDelete onClick={() => handleDeleteTask(task)} />
      </Flex>
    </Box>
  );
};

TaskExpanded.propTypes = {
  task: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    date: PropTypes.string,
  }).isRequired,
};

export default TaskExpanded;

const styles = {
  deleteIcon: {
    height: "1.5em",
    width: "1.5em",
    padding: "2px",
  },
  confirmIcon: {
    height: "1.5em",
    width: "1.5em",
  },
};
