import {createFileRoute} from '@tanstack/react-router'
import MainList from "@/components/lists/TasksList.tsx";
import TaskCreator from "@/components/popover/creatorMenu/TaskCreator.tsx";
import PageLayout from "@/components/base/PageLayout.tsx";
import BaseHeader from "@/components/header/BaseHeader.tsx";

const Tasks = () => {
    return (
        <PageLayout
            header={<BaseHeader/>}
            content={<MainList/>}
            popover={<TaskCreator/>}
        />
    );
};

export const Route = createFileRoute('/app/tasks')({
    component: Tasks,
})