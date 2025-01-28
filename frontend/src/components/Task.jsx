import { Box, Text, Flex, Show } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTaskContext } from "../TaskContext.jsx";
import { isDatePast, textualTimeToDate } from "../scripts/Dates.jsx";
import { MdTaskAlt } from "react-icons/md";

const Task = ({ task }) => {
  const { handleExpandTask } = useTaskContext();

  const handleClick = () => {
    handleExpandTask(task);
  };

  const handleCompleteClick = (e) => {
    e.stopPropagation(); // prevent triggering handleClick
    console.log("complete");
  };

  return (
    <Box
      p="2"
      bg="base.100"
      color="black"
      borderRadius="md"
      boxShadow="sm"
      mb="3.5"
      onClick={handleClick}
      cursor="button"
      {...(isDatePast(task.date) && { bg: "base.400" })}>
      <Flex align="center" justifyContent="space-between">
        <Show when={task.type === "deadline"}>
          <Text>{textualTimeToDate(task.date)}</Text>
        </Show>
        <Text>{task.name}</Text>
        <Show when={task.type === "deadline"}>
          <MdTaskAlt alt="complete" style={styles.completeIcon} onClick={handleCompleteClick} />
        </Show>
      </Flex>
    </Box>
  );
};

Task.propTypes = {
  task: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.string,
    type: PropTypes.string.isRequired,
  }).isRequired,
};

export default Task;

const styles = {
  completeIcon: {
    height: "1.5em",
    width: "1.5em",
    color: "green",
  },
};
