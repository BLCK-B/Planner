import PropTypes from "prop-types";
import { Flex } from "@chakra-ui/react";
import { useTaskContext } from "../TaskContext.jsx";
import Task from "./Task.jsx";
import TaskExpanded from "./TaskExpanded.jsx";
import GoalExpanded from "./GoalExpanded.jsx";
import Goal from "./Goal.jsx";

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
  const { itemList, expandedTaskId } = useTaskContext();

  return (
    <Flex
      direction="column"
      height="100%"
      w={{ base: "82%", sm: "70%", md: "65%" }}
      style={taskType === "long-term" ? styles.longtermList : styles.deadlineList}>
      <div style={{ overflowY: "auto" }}>
        {itemList
          .filter((task) => task.type === taskType)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((task) => (
            <div key={task.key}>{renderTaskType(task, expandedTaskId)}</div>
          ))}
      </div>
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
