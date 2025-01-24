import { Box, Text, Button } from "@chakra-ui/react";
import PropTypes from "prop-types";

const TaskBubble = ({ task, handleDeleteTask }) => {
  return (
    <Box p="4" bg="white" color="black" borderRadius="md" boxShadow="sm" mb="4">
      <Text fontSize="md">
        {task.date} {task.name}
      </Text>
      <Button onClick={() => handleDeleteTask(task)}>Delete</Button>
    </Box>
  );
};

// prop validation
TaskBubble.propTypes = {
  task: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,

  handleDeleteTask: PropTypes.func.isRequired,
};

export default TaskBubble;
