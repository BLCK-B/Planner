import { useEffect } from "react";
import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";
import useFetchPost from "./scripts/useFetchPost.jsx";

const TaskContext = createContext();

export const useTaskContext = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
  const [itemList, setItemList] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [dataIsSaved, setDataIsSaved] = useState(false);

  const handleExpandTask = (task) => {
    setExpandedTaskId((prev) => (prev === task.key ? null : task.key));
  };

  const handleCollapseTask = () => {
    setExpandedTaskId(null);
  };

  const handleUpdateTask = (taskKey, updatedTask) => {
    setItemList((prevTasks) => prevTasks.map((task) => (task.key === taskKey ? { ...task, ...updatedTask } : task)));
    updatedTask.key = taskKey;
    sendPostRequest(API.setItem, "1", updatedTask);
  };

  const handleAddTask = (newTask) => {
    setItemList([...itemList, newTask]);
  };

  const handleDeleteTask = (taskToDelete) => {
    setItemList(itemList.filter((task) => task.key !== taskToDelete.key));
  };

  // --- unexported ---
  const [request, setRequest] = useState("");
  const [requestBody, setRequestBody] = useState("");

  const API = {
    setAllItems: "/users/saveUserItems",
    setItem: "/users/setItem",
    deteleItem: "todo",
  };

  const sendPostRequest = (request, userID, content) => {
    setRequestBody({ userID: userID, items: content });
    setRequest(request);
    setDataIsSaved(true);
  };

  const { data, loading, error } = useFetchPost(request, setRequest, requestBody);

  useEffect(() => {
    if (dataIsSaved) {
      const timer = setTimeout(() => {
        setDataIsSaved(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [dataIsSaved, setDataIsSaved]);

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
