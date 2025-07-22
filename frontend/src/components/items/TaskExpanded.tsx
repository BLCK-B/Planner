import { useState } from "react";
import { Box, Flex, Input } from "@chakra-ui/react";
import { useTaskContext } from "../../TaskContext.tsx";
import { isDatePast } from "../../scripts/Dates.tsx";
import { Field } from "@/components/ui/field";
import ButtonConfirm from "../base/ButtonConfirm.tsx";
import ButtonDelete from "../base/ButtonDelete.tsx";
import useSaveTask from "../queries/UseSaveTask.tsx"
import useDeleteTask from "../queries/UseDeleteTask.tsx"
import Tags from "../base/Tags.tsx";
import type { Task } from "../../types/Task.ts";
import * as React from "react";

type Props = {
  task: Task;
};

const TaskExpanded = ({ task }: Props) => {
  const { handleCollapseTask } = useTaskContext();

  const saveTaskMutation = useSaveTask();
  const deleteTaskMutation = useDeleteTask();

  const [localTask, setLocalTask] = useState<Task>(task);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTask(prev => ({
      ...prev,
      data: {
        ...prev.data,
        name: e.target.value,
      },
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTask(prev => ({
      ...prev,
      data: {
        ...prev.data,
        date: e.target.value,
      },
    }));
  };

  const handleAddTag = (name: string) => {
    setLocalTask(prev => ({
      ...prev,
      data: {
        ...prev.data,
        tags: [...(prev.data.tags ?? []), name],
      },
    }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setLocalTask(prev => ({
      ...prev,
      data: {
        ...prev.data,
        tags: (prev.data.tags ?? []).filter(tag => tag !== tagToRemove),
      },
    }));
  };

  const handleClick = () => {
    // handleCollapseTask();
  };

  const handleConfirmClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await saveTaskMutation.mutateAsync(localTask);
    handleCollapseTask();
  };

  const handleDeleteTaskLocal = async () => {
    await deleteTaskMutation.mutateAsync(localTask);
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
      {...(isDatePast(localTask.data.date) && { bg: "base.400" })}>
      {/* inputs */}
      <Flex gap="6" align="center" justifyContent="start">
        <Input p="2px" variant="subtle" type="date" value={localTask.data.date} onChange={handleDateChange} />
        <Field invalid={!localTask.data.name}>
          <Input p="2px" variant="subtle" value={localTask.data.name} placeholder="Task name" onChange={handleNameChange} />
        </Field>
      </Flex>
      {/* tags */}
      <Tags taskTags={localTask.data.tags} handleAddTag={handleAddTag} handleRemoveTag={handleRemoveTag} />
      {/* buttons */}
      <Flex gap="6" align="center" justifyContent="center">
        <ButtonConfirm disabled={!localTask.data.name} onClick={handleConfirmClick} />
        <ButtonDelete onClick={handleDeleteTaskLocal} />
      </Flex>
    </Box>
  );
};

export default TaskExpanded;
