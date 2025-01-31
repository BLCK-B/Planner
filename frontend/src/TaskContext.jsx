import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export const useTaskContext = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
  const [itemList, setItemList] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const handleExpandTask = (task) => {
    setExpandedTaskId((prev) => (prev === task.key ? null : task.key));
  };

  const handleCollapseTask = () => {
    setExpandedTaskId(null);
  };

  const handleUpdateTask = (taskKey, updatedTask) => {
    setItemList((prevTasks) => prevTasks.map((task) => (task.key === taskKey ? { ...task, ...updatedTask } : task)));
  };

  const handleAddTask = (newTask) => {
    setItemList([...itemList, newTask]);
  };

  const handleDeleteTask = (taskToDelete) => {
    setItemList(itemList.filter((task) => task.key !== taskToDelete.key));
  };

  return (
    <TaskContext.Provider
      value={{
        itemList,
        setItemList,
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
