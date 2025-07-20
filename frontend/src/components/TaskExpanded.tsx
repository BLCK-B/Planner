import { useState } from "react";
import { Box, Flex, Input } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTaskContext } from "../TaskContext.tsx";
import { isDatePast } from "../scripts/Dates.tsx";
import { Field } from "@/components/ui/field";
import ButtonConfirm from "./base/ButtonConfirm.tsx";
import ButtonDelete from "./base/ButtonDelete.tsx";
import fetchRequest from "../scripts/fetchRequest.tsx";
import Tags from "./Tags.tsx";
import type { Task } from "../types/Task";
import * as React from "react";

type Props = {
  task: Task;
};

const TaskExpanded = ({ task }: Props) => {
  const { handleCollapseTask, handleDeleteTask, handleUpdateTask } = useTaskContext();

  const [taskName, setTaskName] = useState(task.data.name);
  const [taskDate, setTaskDate] = useState(task.data.date);
  const [taskTags, setTaskTags] = useState(task.data.tags || []);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskDate(e.target.value);
  };
  const handleAddTag = (name: string) => {
    if (name) {
      setTaskTags((prevTags) => [...prevTags, name]);
    }
  };
  const handleRemoveTag = (tagToRemove: string) => {
    setTaskTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const handleClick = () => {
    // handleCollapseTask();
  };

  const handleConfirmClick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newTask: Task = {
      itemID: task.itemID,
      data: {
        name: taskName,
        date: taskDate,
        type: task.data.type,
        tags: taskTags,
      },
    };
    const response = await fetchRequest("PUT", "/users/userTask", newTask);
    handleUpdateTask(newTask);
    handleCollapseTask();
  };

  const handleDeleteTaskLocal = async (task: Task) => {
    const response = await fetchRequest("DELETE", `/users/userTask/${task.itemID}`);
    if (!response.error) {
      handleDeleteTask(task);
    }
  };

  return (
    <Box
      p="2"
      bg="base.100"
      color="black"
      borderRadius="md"
      boxShadow="sm"
      mb="4"
      onClick={handleClick}
      cursor="button"
      {...(isDatePast(task.data.date) && { bg: "base.400" })}>
      {/* inputs */}
      <Flex gap="6" align="center" justifyContent="start">
        <Input p="2px" variant="subtle" type="date" value={taskDate} onChange={handleDateChange} />
        <Field invalid={!taskName}>
          <Input p="2px" variant="subtle" value={taskName} placeholder="Task name" onChange={handleNameChange} />
        </Field>
      </Flex>
      {/* tags */}
      <Tags taskTags={taskTags} handleAddTag={handleAddTag} handleRemoveTag={handleRemoveTag} />
      {/* buttons */}
      <Flex gap="6" align="center" justifyContent="center">
        <ButtonConfirm disabled={!taskName} onClick={handleConfirmClick} />
        <ButtonDelete onClick={() => handleDeleteTaskLocal(task)} />
      </Flex>
    </Box>
  );
};

TaskExpanded.propTypes = {
  task: PropTypes.shape({
    itemID: PropTypes.string.isRequired,
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      date: PropTypes.string,
      tags: PropTypes.array,
    }).isRequired,
  }).isRequired,
};

export default TaskExpanded;
