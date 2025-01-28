import { useState } from "react";
import { Box, Flex, Input, Show, Textarea } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import PropTypes from "prop-types";
import { useTaskContext } from "../TaskContext.jsx";
import ButtonConfirm from "./ButtonConfirm.jsx";
import ButtonDelete from "./ButtonDelete.jsx";

const GoalExpanded = ({ task }) => {
  const { handleCollapseTask, handleDeleteTask, handleUpdateTask } = useTaskContext();

  const [taskName, setTaskName] = useState(task.name);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const handleNameChange = (e) => {
    setTaskName(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    setTaskDescription(e.target.value);
  };

  const handleClick = () => {
    // handleCollapseTask();
  };

  const handleConfirmClick = (e) => {
    e.stopPropagation();
    handleUpdateTask(task.key, { name: taskName, type: task.type, description: taskDescription });
    handleCollapseTask();
  };

  return (
    <Box p="2" bg="base.100" color="black" borderRadius="md" boxShadow="sm" mb="4" onClick={handleClick} cursor="button">
      {/* inputs */}
      <Flex gap="6" align="center" justifyContent="start">
        <Field invalid={!taskName}>
          <Input p="2px" variant="subtle" value={taskName} placeholder="Long-term goal" onChange={handleNameChange} />
        </Field>
      </Flex>
      <Show when={task.type === "long-term"}>
        <Textarea
          style={styles.taskDescriptionField}
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
        <ButtonConfirm disabled={!taskName} onClick={handleConfirmClick} />
        <ButtonDelete onClick={() => handleDeleteTask(task)} />
      </Flex>
    </Box>
  );
};

GoalExpanded.propTypes = {
  task: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
};

export default GoalExpanded;

const styles = {
  taskDescriptionField: {
    padding: "4px",
    marginTop: "5px",
    marginBottom: "5px",
  },
};
