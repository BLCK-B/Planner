import PropTypes from "prop-types";
import { Flex } from "@chakra-ui/react";
import { useTaskContext } from "../TaskContext.jsx";
import TaskBubble from "../components/TaskBubble.jsx";
import TaskBubbleExpanded from "../components/TaskBubbleExpanded.jsx";
import "../styles/App.css";

const TaskList = ({ taskType }) => {
  const { taskList, expandedTaskId } = useTaskContext();

  return (
    <Flex direction="column" height="100%" className={taskType === "long-term" ? "longtermList" : "deadlineList"}>
      <div style={{ overflowY: "auto" }}>
        {taskList
          .filter((task) => task.type === taskType)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((task) => (
            <div key={task.key}>
              {expandedTaskId === task.key ? <TaskBubbleExpanded task={task} /> : <TaskBubble task={task} />}
            </div>
          ))}
      </div>
    </Flex>
  );
};

TaskList.propTypes = {
  taskType: PropTypes.string.isRequired,
};

export default TaskList;
