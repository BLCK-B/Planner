import { Box, Text, Button, Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTaskContext } from "../TaskContext.jsx";

const TaskBubble = ({ task }) => {
  const { handleExpandTask } = useTaskContext();

  const handleClick = () => {
    handleExpandTask(task); // This will expand the task when the bubble is clicked
  };

  const handleCompleteClick = (e) => {
    e.stopPropagation(); // prevent triggering handleClick
    console.log("complete");
  };

  return (
    <Box p="2" bg="white" color="black" borderRadius="md" boxShadow="sm" mb="4" w="50%" onClick={handleClick} cursor="button">
      <Flex gap="6" align="center" justifyContent="start">
        <Text fontSize="md">{task.date}</Text>
        <Text fontSize="md">{task.name}</Text>
        <Button bg="orange" p="0" onClick={handleCompleteClick}>
          Complete
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
};

export default TaskBubble;
