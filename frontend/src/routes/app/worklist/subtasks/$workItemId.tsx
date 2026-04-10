import PageLayout from "@/components/base/PageLayout.tsx";
import BaseHeader from "@/components/header/BaseHeader.tsx";
import SubtasksList from "@/components/lists/SubtasksList.tsx";
import WorkItemCreator from "@/components/popover/creatorMenu/WorkItemCreator.tsx";
import {createFileRoute} from "@tanstack/react-router";
import {useSetAtom} from "jotai";
import {explainerModal} from "../../../../global/atoms";
import {MdInfo} from "react-icons/md";

const WorkItemId = () => {

    const setShowExplainer = useSetAtom(explainerModal);

    const infoButton = <MdInfo style={{width: "1.5rem", height: "1.5rem", color: "grey"}} cursor="pointer"
                               onClick={() => setShowExplainer('worklistExplainer')}/>

    return (
        <PageLayout
            header={<BaseHeader rightSide={infoButton}/>}
            content={<SubtasksList/>}
            popover={<WorkItemCreator/>}
        />
    );
};

export const Route = createFileRoute('/app/worklist/subtasks/$workItemId')({
    component: WorkItemId,
})