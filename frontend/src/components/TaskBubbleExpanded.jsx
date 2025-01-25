import { Box, Text, Button, Flex, Input } from "@chakra-ui/react";
import PropTypes from "prop-types";

const TaskBubble = ({ task, handleDeleteTask }) => {
  const expandBubble = () => {};

  return (
    <Box p="2" bg="white" color="black" borderRadius="md" boxShadow="sm" mb="4" w="50%">
      <Flex gap="6" align="center" justifyContent="start">
        <Input w="40%" type="date" value={task.date} placeholder={task.date} />
        <Input w="40%" value={task.name} placeholder={task.name} />
      </Flex>
      <Flex gap="6" align="center" justifyContent="center">
        <Button bg="green" p="0">
          Confirm
        </Button>
        <Button bg="red" p="0" onClick={() => handleDeleteTask(task)}>
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
