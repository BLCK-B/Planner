import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export const useTaskContext = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const handleExpandTask = (task) => {
    setExpandedTaskId((prev) => (prev === task.key ? null : task.key));
  };

  return <TaskContext.Provider value={{ expandedTaskId, handleExpandTask }}>{children}</TaskContext.Provider>;
};
