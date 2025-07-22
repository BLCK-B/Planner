import {useEffect} from "react";
import {useQuery} from "@tanstack/react-query"
import {Flex} from "@chakra-ui/react";
import {useTaskContext} from "../../TaskContext.tsx";
import TaskExpanded from "../items/TaskExpanded.tsx";
import Task from "../items/Task.tsx";
import loadItemsQuery from "../queries/LoadItemsQuery.tsx";
import type {Task as TaskType} from "../../types/Task.ts";

const ItemsWithDate = () => {
    const {expandedTaskId, itemList, setItemList} = useTaskContext();

    const {data} = useQuery<TaskType[]>(loadItemsQuery());

    const renderTaskType = (task: TaskType, expandedTaskId: string) => {
        if (expandedTaskId !== task.itemID) {
            return <Task {...task} />;
        } else {
            return <TaskExpanded task={task}/>;
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

    const filterWithDate = (task: TaskType) => {
        return task.data.date;
    };

    return (
        <Flex
            direction="column"
            height="100%"
            w={{base: "82%", sm: "70%", md: "65%"}}
            style={styles.deadlineList}>
            <div style={{overflowY: "scroll", scrollbarWidth: "none"}}>
                {itemList
                    .filter(filterWithDate)
                    .sort(sortDates)
                    .map((task) => (
                        <div key={task.itemID}>{renderTaskType(task, expandedTaskId)}</div>
                    ))}
            </div>
        </Flex>
    );
};

export default ItemsWithDate;

const styles = {
    deadlineList: {
        justifyContent: "flex-end",
        margin: "0 auto",
    },
};
