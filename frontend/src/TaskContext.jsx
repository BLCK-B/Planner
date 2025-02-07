import { useEffect } from "react";
import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";
import fetchPost from "./scripts/fetchPost.jsx";

const TaskContext = createContext();

export const useTaskContext = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
  const [itemList, setItemList] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [dataIsSaved, setDataIsSaved] = useState(false);
  const [dataSaveRequest, setDataSaveRequest] = useState(false);

  const handleExpandTask = (task) => {
    setExpandedTaskId((prev) => (prev === task.key ? null : task.key));
  };

  const handleCollapseTask = () => {
    setExpandedTaskId(null);
  };

  const handleUpdateTask = (taskKey, updatedTask) => {
    setItemList((prevTasks) => prevTasks.map((task) => (task.key === taskKey ? { ...task, ...updatedTask } : task)));
    setDataSaveRequest(true);
  };

  const handleAddTask = (newTask) => {
    setItemList([...itemList, newTask]);
  };

  const handleDeleteTask = (taskToDelete) => {
    setItemList(itemList.filter((task) => task.key !== taskToDelete.key));
  };

  // --- unexported ---

  useEffect(() => {
    if (dataIsSaved) {
      const timer = setTimeout(() => {
        setDataIsSaved(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [dataIsSaved, setDataIsSaved]);

  // hook triggered by request to launch an async request
  useEffect(() => {
    const saveUserDataPost = async () => {
      const { data, loading, error } = await fetchPost("/users/saveUserItems", { userID: "1", items: itemList });
    };

    if (dataSaveRequest) {
      saveUserDataPost();
      setDataIsSaved(true);
    }
  }, [dataSaveRequest, itemList]);

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
        dataIsSaved,
      }}>
      {children}
    </TaskContext.Provider>
  );
};

TaskProvider.propTypes = {
  children: PropTypes.any,
};
