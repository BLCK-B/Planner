import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export const useTaskContext = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
  // const [itemList, setItemList] = useState([
  //   { name: "Learn", date: "2025-01-25", type: "deadline", tags: [], key: "1" },
  //   { name: "Walk", date: "2025-02-01", type: "deadline", tags: [], key: "2" },
  //   { name: "Drink", date: "2025-02-05", type: "deadline", tags: [], key: "3" },
  //   { name: "Achieve", type: "long-term", key: "4" },
  //   { name: "Win", description: "In order to win you must not lose. How smart.", type: "long-term", key: "5" },
  //   { name: "Reach", type: "long-term", key: "6" },
  // ]);

  // testing scrolling
  const [itemList, setItemList] = useState([
    { name: "Learn", date: "2025-01-25", type: "deadline", tags: [], key: "1" },
    { name: "Walk", date: "2025-02-01", type: "deadline", tags: [], key: "2" },
    { name: "Drink", date: "2025-02-05", type: "deadline", tags: [], key: "3" },
    { name: "Learn", date: "2025-01-25", type: "deadline", tags: [], key: "4" },
    { name: "Walk", date: "2025-02-01", type: "deadline", tags: [], key: "5" },
    { name: "Drink", date: "2025-02-05", type: "deadline", tags: [], key: "6" },
    { name: "Learn", date: "2025-01-30", type: "deadline", tags: [], key: "7" },
    { name: "Walk", date: "2025-01-31", type: "deadline", tags: [], key: "8" },
    { name: "Drink", date: "2025-02-01", type: "deadline", tags: [], key: "9" },
    { name: "Learn", date: "2025-01-25", type: "deadline", tags: [], key: "10" },
    { name: "Walk", date: "2025-02-03", type: "deadline", tags: [], key: "11" },
    { name: "Drink", date: "2025-02-04", type: "deadline", tags: [], key: "12" },
    { name: "Learn", date: "2025-01-25", type: "deadline", tags: [], key: "13" },
    { name: "Walk", date: "2025-03-04", type: "deadline", tags: [], key: "14" },
    { name: "Drink", date: "2025-06-08", type: "deadline", tags: [], key: "15" },
  ]);

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
