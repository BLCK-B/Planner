import {createFileRoute} from '@tanstack/react-router'
import MainList from "@/components/lists/TasksList.tsx";
import TaskCreator from "@/components/popover/creatorMenu/TaskCreator.tsx";
import PageLayout from "@/components/base/PageLayout.tsx";
import BaseHeader from "@/components/header/BaseHeader.tsx";
import {useSetAtom} from "jotai";
import {explainerModal} from "../../global/atoms";
import {MdInfo} from "react-icons/md";

const Tasks = () => {

    const setShowExplainer = useSetAtom(explainerModal);

    const infoButton = <MdInfo style={{width: "1.5rem", height: "1.5rem", color: "grey"}} cursor="pointer"
                               onClick={() => setShowExplainer('tasksExplainer')}/>

    return (
        <PageLayout
            header={<BaseHeader rightSide={infoButton}/>}
            content={<MainList/>}
            popover={<TaskCreator/>}
        />
    );
};

export const Route = createFileRoute('/app/tasks')({
    component: Tasks,
})