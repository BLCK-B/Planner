import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export const useTaskContext = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
  const [taskList, setTaskList] = useState([
    { name: "Learn", date: "2025-01-25", type: "deadline", key: "1" },
    { name: "Walk", date: "2025-02-01", type: "deadline", key: "2" },
    { name: "Drink", date: "2025-02-05", type: "deadline", key: "3" },
    { name: "Achieve", type: "long-term", key: "4" },
    { name: "Win", type: "long-term", key: "5" },
    { name: "Reach", type: "long-term", key: "6" },
  ]);

  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const handleExpandTask = (task) => {
    setExpandedTaskId((prev) => (prev === task.key ? null : task.key));
  };

  const handleCollapseTask = () => {
    setExpandedTaskId(null);
  };

  const handleUpdateTask = (taskKey, updatedTask) => {
    setTaskList((prevTasks) => prevTasks.map((task) => (task.key === taskKey ? { ...task, ...updatedTask } : task)));
  };

  const handleAddTask = (newTask) => {
    setTaskList([...taskList, newTask]);
  };

  const handleDeleteTask = (taskToDelete) => {
    setTaskList(taskList.filter((task) => task.key !== taskToDelete.key));
  };

  return (
    <TaskContext.Provider
      value={{
        taskList,
        expandedTaskId,
        handleExpandTask,
        handleCollapseTask,
        handleUpdateTask,
        handleAddTask,
        handleDeleteTask,
      }}>
      {children}
    </TaskContext.Provider>
  );
};

TaskProvider.propTypes = {
  children: PropTypes.any,
};
