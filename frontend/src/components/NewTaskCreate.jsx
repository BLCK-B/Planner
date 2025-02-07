import { useTaskContext } from "../TaskContext.jsx";
import { IoAddCircle } from "react-icons/io5";
import PropTypes from "prop-types";

const NewTaskCreate = ({ taskType }) => {
  const { handleAddTask, handleExpandTask } = useTaskContext();

  const addTask = () => {
    console.log(taskType);
    let newTask;
    if (taskType === "long-term") {
      newTask = { name: "", type: taskType, key: Math.floor(Math.random() * 1000000).toString() };
    } else if (taskType === "deadline") {
      newTask = {
        name: "",
        date: String.toString(new Date()),
        type: taskType,
        key: Math.floor(Math.random() * 1000000).toString(),
        tags: [],
      };
    }
    handleAddTask(newTask);
    handleExpandTask(newTask);
  };

  return <IoAddCircle alt="New task" onClick={addTask} style={styles.createTaskIcon} />;
};

export default NewTaskCreate;

NewTaskCreate.propTypes = {
  taskType: PropTypes.string.isRequired,
};

const styles = {
  createTaskIcon: {
    height: "2em",
    width: "2em",
    position: "absolute",
  },
};
