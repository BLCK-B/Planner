import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query"
import { Flex } from "@chakra-ui/react";
import { useTaskContext } from "../TaskContext.tsx";
import TaskExpanded from "./TaskExpanded.tsx";
import Task from "./Task.tsx";
import loadItemsQuery from "./queries/LoadItemsQuery.tsx";
import type { Task as TaskType } from "../types/Task";

type Props = {
  taskType: string;
};

const ItemList = ({ taskType }: Props) => {
  const { expandedTaskId, itemList, setItemList } = useTaskContext();

  const { data } = useQuery<TaskType[]>(loadItemsQuery());

  const renderTaskType = (task: TaskType, expandedTaskId: string) => {
    switch (true) {
      case expandedTaskId !== task.itemID && task.data.type === "deadline":
        return <Task {...task } />;
      case expandedTaskId === task.itemID && task.data.type === "deadline":
        return <TaskExpanded task={task} />;
      default:
        console.warn("wrong task type");
    }
  };

  useEffect(() => {
    if (data) {
      setItemList(data);
    }
  }, [data, setItemList]);

  const sortDates = (a: TaskType, b: TaskType): number => {
    return new Date(b.data.date).getTime() - new Date(a.data?.date).getTime();
  };

  return (
    <Flex
      direction="column"
      height="100%"
      w={{ base: "82%", sm: "70%", md: "65%" }}
      style={taskType === "long-term" ? styles.longtermList : styles.deadlineList}>
      <div style={{ overflowY: "scroll", scrollbarWidth: "none" }}>
        {itemList
            .filter((task) => task && task.data.type === taskType)
            .sort(sortDates)
            .map((task) => (
                <div key={task.itemID}>{renderTaskType(task, expandedTaskId)}</div>
            ))}
      </div>
    </Flex>
  );
};

export default ItemList;

const styles = {
  longtermList: {
    justifyContent: "flex-start",
    margin: "0 auto",
  },

  deadlineList: {
    justifyContent: "flex-end",
    margin: "0 auto",
  },
};
