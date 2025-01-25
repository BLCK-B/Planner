import { Box, Text, Button, Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";

const TaskBubble = ({ task, handleDeleteTask }) => {
  return (
    <Box p="4" bg="white" color="black" borderRadius="md" boxShadow="sm" mb="4">
      <Flex gap="6" align="center">
        <Text fontSize="md">{task.date}</Text>
        <Text fontSize="md">{task.name}</Text>
        <Button bg="orange" p="0" onClick={() => handleDeleteTask(task)}>
          Delete
        </Button>
      </Flex>
    </Box>
  );
};

// prop validation
TaskBubble.propTypes = {
  task: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.string,
  }).isRequired,

  handleDeleteTask: PropTypes.func.isRequired,
};

export default TaskBubble;
