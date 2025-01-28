import PropTypes from "prop-types";
import { Flex } from "@chakra-ui/react";
import { useTaskContext } from "../TaskContext.jsx";
import Task from "./Task.jsx";
import TaskExpanded from "./TaskExpanded.jsx";
import GoalExpanded from "./GoalExpanded.jsx";
import "../styles/App.css";

const renderTaskType = (task, expandedTaskId) => {
  if (expandedTaskId === task.key) {
    if (task.type === "long-term") {
      return <GoalExpanded task={task} />;
    } else if (task.type === "deadline") {
      return <TaskExpanded task={task} />;
    } else console.warn("wrong task type");
  }
  return <Task task={task} />;
};

const TaskList = ({ taskType }) => {
  const { taskList, expandedTaskId } = useTaskContext();

  return (
    <Flex direction="column" height="100%" className={taskType === "long-term" ? "longtermList" : "deadlineList"}>
      <div style={{ overflowY: "auto" }}>
        {taskList
          .filter((task) => task.type === taskType)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((task) => (
            <div key={task.key}>{renderTaskType(task, expandedTaskId)}</div>
          ))}
      </div>
    </Flex>
  );
};

TaskList.propTypes = {
  taskType: PropTypes.string.isRequired,
};

export default TaskList;
