import { Box, Text, Button, Flex, Show } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTaskContext } from "../TaskContext.jsx";

const TaskBubble = ({ task }) => {
  const { handleExpandTask } = useTaskContext();

  const handleClick = () => {
    handleExpandTask(task);
  };

  const handleCompleteClick = (e) => {
    e.stopPropagation(); // prevent triggering handleClick
    console.log("complete");
  };

  return (
    <Box p="2" bg="white" color="black" borderRadius="md" boxShadow="sm" mb="4" onClick={handleClick} cursor="button">
      <Flex gap="6" align="center" justifyContent="start">
        <Show when={task.type === "deadline"}>
          <Text fontSize="md">{task.date}</Text>
        </Show>

        <Text fontSize="md">{task.name}</Text>
        <Button bg="orange" p="0" onClick={handleCompleteClick}>
          Complete
        </Button>
      </Flex>
    </Box>
  );
};

TaskBubble.propTypes = {
  task: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.string,
    type: PropTypes.string.isRequired,
  }).isRequired,
};

export default TaskBubble;
