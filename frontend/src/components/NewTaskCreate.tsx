import { useTaskContext } from "../TaskContext.tsx";
import { IoAddCircle } from "react-icons/io5";
import PropTypes from "prop-types";
import type { Task } from "../types/Task";
import type { Properties } from 'csstype';

type Props = {
  taskType: string;
}

const NewTaskCreate = ({ taskType } : Props) => {
  const { handleAddTask, handleExpandTask } = useTaskContext();

  const addTask = () => {
    console.log(taskType);
    const newTask: Task = {
      itemID: '',
      data: {
        name: "",
        date: new Date().toDateString(),
        type: taskType,
        tags: [],
      },
    };
    handleAddTask(newTask);
    handleExpandTask(newTask);
  };

  return <IoAddCircle aria-label="New task" onClick={addTask} style={styles.createTaskIcon} />;
};

export default NewTaskCreate;

NewTaskCreate.propTypes = {
  taskType: PropTypes.string.isRequired,
};

const styles: { createTaskIcon: Properties } = {
  createTaskIcon: {
    height: "2em",
    width: "2em",
    position: "absolute",
  },
};