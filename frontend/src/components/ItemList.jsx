import { useEffect } from "react";
import PropTypes from "prop-types";
import { Flex, Button } from "@chakra-ui/react";
import { useTaskContext } from "../TaskContext.jsx";
import Task from "./Task.jsx";
import TaskExpanded from "./TaskExpanded.jsx";
import GoalExpanded from "./GoalExpanded.jsx";
import Goal from "./Goal.jsx";
import useFetch from "../scripts/useFetch.jsx";
import fetchPost from "../scripts/fetchPost.jsx";

const renderTaskType = (task, expandedTaskId) => {
  switch (true) {
    case expandedTaskId !== task.key && task.type === "long-term":
      return <Goal task={task} />;
    case expandedTaskId !== task.key && task.type === "deadline":
      return <Task task={task} />;
    case expandedTaskId === task.key && task.type === "long-term":
      return <GoalExpanded task={task} />;
    case expandedTaskId === task.key && task.type === "deadline":
      return <TaskExpanded task={task} />;
    default:
      console.warn("wrong task type");
  }
};

const ItemList = ({ taskType }) => {
  const { expandedTaskId, itemList, setItemList } = useTaskContext();

  const handleButtonClick = async () => {
    const { data, loading, error } = await fetchPost("/saveUserItems", { userID: "1", items: itemList });

    if (loading) {
      console.log("Saving...");
    } else if (error) {
      console.log("Error saving:", error);
    } else {
      console.log("Data saved:", data);
    }
  };

  // const { data, loading, error } = useFetch("/getTasksHardcoded");
  const { data, loading, error } = useFetch("/loadItems");
  useEffect(() => {
    if (data) {
      const parsedItems = data.flatMap((item) => item.items.map((task) => JSON.parse(task)));
      console.log(parsedItems);
      setItemList(parsedItems);
    }
  }, [data, setItemList]);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error fetching tasks: {error}</p>;

  return (
    <Flex
      direction="column"
      height="100%"
      w={{ base: "82%", sm: "70%", md: "65%" }}
      style={taskType === "long-term" ? styles.longtermList : styles.deadlineList}>
      <div style={{ overflowY: "scroll", scrollbarWidth: "none" }}>
        {itemList
          .filter((task) => task.type === taskType)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((task) => (
            <div key={task.key}>{renderTaskType(task, expandedTaskId)}</div>
          ))}
      </div>
      <Button onClick={handleButtonClick}>click to save</Button>
    </Flex>
  );
};

ItemList.propTypes = {
  taskType: PropTypes.string.isRequired,
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
