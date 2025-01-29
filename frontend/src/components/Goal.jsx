import { Box, Text, Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTaskContext } from "../TaskContext.jsx";

const Goal = ({ task }) => {
  const { handleExpandTask } = useTaskContext();

  const handleClick = () => {
    handleExpandTask(task);
  };

  return (
    <Box p="2" bg="base.100" color="black" borderRadius="md" boxShadow="sm" mb="3.5" onClick={handleClick} cursor="button">
      <Flex align="center" justifyContent="space-between">
        <Text>{task.name}</Text>
      </Flex>
    </Box>
  );
};

Goal.propTypes = {
  task: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.string,
    type: PropTypes.string.isRequired,
  }).isRequired,
};

export default Goal;
