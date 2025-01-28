import { useTaskContext } from "../TaskContext.jsx";
import { IoAddCircle } from "react-icons/io5";
import PropTypes from "prop-types";
import "../styles/App.css";

const NewTaskCreate = ({ taskType }) => {
  const { handleAddTask, handleExpandTask } = useTaskContext();

  const addTask = () => {
    console.log(taskType);
    let newTask;
    if (taskType === "long-term") {
      newTask = { name: "", type: taskType, key: "55" };
    } else if (taskType === "deadline") {
      newTask = { name: "", date: String.toString(new Date()), type: taskType, key: "55" };
    }
    handleAddTask(newTask);
    handleExpandTask(newTask);
  };

  return <IoAddCircle alt="New task" onClick={addTask} className="createTaskIcon" />;
};

export default NewTaskCreate;

NewTaskCreate.propTypes = {
  taskType: PropTypes.string.isRequired,
};
