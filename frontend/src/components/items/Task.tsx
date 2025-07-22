import { Box, Text, Flex, Spacer } from "@chakra-ui/react";
import { useTaskContext } from "../../TaskContext.tsx";
import { isDatePast, textualTimeToDate } from "../../scripts/Dates.tsx";
import ButtonComplete from "../base/ButtonComplete.tsx";
import Tags from "../base/Tags.tsx";
import type { Task as TaskType } from "../../types/Task.ts";
import * as React from "react";

const Task = (task: TaskType) => {
  const { handleExpandTask } = useTaskContext();

  const handleClick = () => {
    handleExpandTask(task);
  };

  const handleCompleteClick = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      {...(isDatePast(task.data.date) && { bg: "base.400" })}>
      <Flex align="center" justifyContent="space-between">
        <Text w="120px">{textualTimeToDate(task.data.date)}</Text>
        <Text>{task.data.name}</Text>
        <Spacer />
        <ButtonComplete onClick={handleCompleteClick} />
      </Flex>
      <Tags taskTags={task.data.tags!} />
    </Box>
  );
};

export default Task;
