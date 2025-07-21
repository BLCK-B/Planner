import {type ReactNode, useEffect} from "react";
import { createContext, useContext, useState } from "react";
import type {Task} from "./types/Task.tsx";
import * as React from "react";

type TaskContextType = {
    itemList: Task[];
    setItemList: React.Dispatch<React.SetStateAction<Task[]>>;
    expandedTaskId: string;
    handleExpandTask: (task: Task) => void;
    handleCollapseTask: () => void;
    handleUpdateTask: (updatedTask: Task) => void;
    handleAddTask: (newTask: Task) => void;
    handleDeleteTask: (taskToDelete: Task) => void;
    dataIsSaved: boolean;
};

type Props = {
    children: ReactNode
};

const TaskContext = createContext<TaskContextType | null>(null);

export const useTaskContext = (): TaskContextType => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTaskContext must be used within a TaskProvider");
    }
    return context;
};

export const TaskProvider = ({ children }: Props) => {
    const [itemList, setItemList] = useState<Task[]>([]);
    const [expandedTaskId, setExpandedTaskId] = useState<string>('');
    const [dataIsSaved, setDataIsSaved] = useState(false);

  const handleExpandTask = (task: Task) => {
    setExpandedTaskId((prev) => (prev === task.itemID ? '' : task.itemID));
  };

  const handleCollapseTask = () => {
    setExpandedTaskId('');
  };

  const handleAddTask = (newTask: Task) => {
    setItemList([...itemList, newTask]);
  };

  const handleDeleteTask = (taskToDelete: Task) => {
    setItemList(itemList.filter((task) => task.itemID !== taskToDelete.itemID));
  };

  // --- unexported ---
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
        handleAddTask,
        handleDeleteTask,
        dataIsSaved,
      }}>
      {children}
    </TaskContext.Provider>
  );
};