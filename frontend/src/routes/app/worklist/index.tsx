import PageLayout from "@/components/base/PageLayout.tsx";
import BaseHeader from "@/components/header/BaseHeader.tsx";
import WorkList from "@/components/lists/WorkItemsList.tsx";
import WorkItemCreator from "@/components/popover/creatorMenu/WorkItemCreator.tsx";
import {createFileRoute} from "@tanstack/react-router";

const Index = () => {

    return (
        <PageLayout
            header={<BaseHeader/>}
            content={<WorkList/>}
            popover={<WorkItemCreator/>}
        />
    );
};

export const Route = createFileRoute('/app/worklist/')({
    component: Index,
})