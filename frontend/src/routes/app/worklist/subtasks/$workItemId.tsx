import PageLayout from "@/components/base/PageLayout.tsx";
import BaseHeader from "@/components/header/BaseHeader.tsx";
import SubtasksList from "@/components/lists/SubtasksList.tsx";
import WorkItemCreator from "@/components/popover/creatorMenu/WorkItemCreator.tsx";
import {createFileRoute} from "@tanstack/react-router";

const WorkItemId = () => {

    return (
        <PageLayout
            header={<BaseHeader/>}
            content={<SubtasksList/>}
            popover={<WorkItemCreator/>}
        />
    );
};

export const Route = createFileRoute('/app/worklist/subtasks/$workItemId')({
    component: WorkItemId,
})