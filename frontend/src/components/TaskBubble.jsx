import { Box, Text, Flex, Show } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTaskContext } from "../TaskContext.jsx";
import { textualTimeToDate } from "../scripts/Dates.jsx";
import { MdTaskAlt } from "react-icons/md";
import "../styles/App.css";

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
    <Box p="2" bg="base.100" color="black" borderRadius="md" boxShadow="sm" mb="4" onClick={handleClick} cursor="button">
      <Flex align="center" justifyContent="space-between">
        <Show when={task.type === "deadline"}>
          <Text fontSize="md">{textualTimeToDate(task.date)}</Text>
        </Show>

        <Text fontSize="md">{task.name}</Text>
        <MdTaskAlt alt="complete" className="completeIcon" onClick={handleCompleteClick} />
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
