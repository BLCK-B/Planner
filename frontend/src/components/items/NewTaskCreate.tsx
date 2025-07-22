import {useTaskContext} from "../../TaskContext.tsx";
import {IoAddCircle} from "react-icons/io5";
import type {Task} from "../../types/Task.ts";
import type {Properties} from 'csstype';

type Props = {
    taskType: string;
}

const NewTaskCreate = ({taskType}: Props) => {
    const {handleAddTask, handleExpandTask} = useTaskContext();

    const isDate = () => {
        return taskType === "with-date";
    }

    const addTask = () => {
        const newTask: Task = {
            itemID: '',
            data: {
                name: "",
                date: isDate() ? new Date().toDateString() : "",
                type: taskType,
                tags: [],
            },
        };
        handleAddTask(newTask);
        handleExpandTask(newTask);
    };

    return <IoAddCircle aria-label="New task" onClick={addTask} style={styles.createTaskIcon}/>;
};

export default NewTaskCreate;

const styles: { createTaskIcon: Properties } = {
    createTaskIcon: {
        height: "2em",
        width: "2em",
        position: "absolute",
    },
};