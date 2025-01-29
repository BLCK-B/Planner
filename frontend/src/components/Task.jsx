import { Box, Text, Flex, Spacer } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTaskContext } from "../TaskContext.jsx";
import { isDatePast, textualTimeToDate } from "../scripts/Dates.jsx";
import ButtonComplete from "./ButtonComplete.jsx";
import Tags from "./Tags.jsx";

const Task = ({ task }) => {
  const { handleExpandTask } = useTaskContext();

  const handleClick = () => {
    handleExpandTask(task);
  };

  const handleCompleteClick = (e) => {
    e.stopPropagation(); // prevent triggering handleClick
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
        <Text w="120px">{textualTimeToDate(task.date)}</Text>
        <Text>{task.name}</Text>
        <Spacer />
        <ButtonComplete onClick={handleCompleteClick} />
      </Flex>
      <Tags taskTags={task.tags} />
    </Box>
  );
};

Task.propTypes = {
  task: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.string,
    type: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
  }).isRequired,
};

export default Task;
