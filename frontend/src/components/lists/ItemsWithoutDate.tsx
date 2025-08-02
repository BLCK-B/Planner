import {useEffect} from "react";
import {useQuery} from "@tanstack/react-query"
import {Flex} from "@chakra-ui/react";
import {useTaskContext} from "@/TaskContext.tsx";
import TaskExpanded from "@/components/items/TaskExpanded.tsx";
import Task from "@/components/items/Task.tsx";
import loadItemsQuery from "@/queries/LoadItemsQuery.tsx";
import {customSort} from '@/scripts/Sorting.tsx';
import type {Task as TaskType} from "@/types/Task.ts";

const ItemsWithoutDate = () => {
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

    const filterWithoutDate = (task: TaskType) => {
        return !task.data.date;
    };

    return (
        <Flex
            direction="column"
            height="100%"
            w={{base: "82%", sm: "70%", md: "65%"}}
            style={styles.longtermList}>
            <div style={{overflowY: "scroll", scrollbarWidth: "none"}}>
                {itemList
                    .filter(filterWithoutDate)
                    .sort(customSort)
                    .map((task) => (
                        <div key={task.itemID}>{renderTaskType(task, expandedTaskId)}</div>
                    ))}
            </div>
        </Flex>
    );
};

export default ItemsWithoutDate;

const styles = {
    longtermList: {
        justifyContent: "flex-start",
        margin: "0 auto",
    },
};
