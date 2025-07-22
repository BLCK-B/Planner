import {Box, Card, Center, Dialog, Button, Portal} from "@chakra-ui/react";
// import {useTaskContext} from "../../TaskContext.tsx";
import type {Task} from "../../types/Task.ts";
import type {Properties} from 'csstype';
import TaskExpanded from "../items/TaskExpanded.tsx";

const CreatorMenu = () => {

    // const {handleAddTask, handleExpandTask} = useTaskContext();

    const newItem: Task = {
        itemID: '',
        data: {
            name: "",
            date: "",
            type: "",
            tags: [],
        },
    };

    // const addTask = () => {
    //     const newTask: Task = {
    //         itemID: '',
    //         data: {
    //             name: "",
    //             date: isDate() ? new Date().toDateString() : "",
    //             type: taskType,
    //             tags: [],
    //         },
    //     };
    //     handleAddTask(newTask);
    //     handleExpandTask(newTask);
    // };

    return (
        <Dialog.Root defaultOpen size={"lg"}>
            <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Dialog Title</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <TaskExpanded task={newItem}/>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button>Save</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default CreatorMenu;
