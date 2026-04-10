import PageLayout from "@/components/base/PageLayout.tsx";
import BaseHeader from "@/components/header/BaseHeader.tsx";
import WorkList from "@/components/lists/WorkItemsList.tsx";
import WorkItemCreator from "@/components/popover/creatorMenu/WorkItemCreator.tsx";
import {createFileRoute} from "@tanstack/react-router";
import {MdInfo} from "react-icons/md";
import {useSetAtom} from "jotai";
import {explainerModal} from "../../../global/atoms";

const Index = () => {

    const setShowExplainer = useSetAtom(explainerModal);

    const infoButton = <MdInfo style={{width: "1.5rem", height: "1.5rem", color: "grey"}} cursor="pointer"
                               onClick={() => setShowExplainer('worklistExplainer')}/>

    return (
        <PageLayout
            header={<BaseHeader rightSide={infoButton}/>}
            content={<WorkList/>}
            popover={<WorkItemCreator/>}
        />
    );
};

export const Route = createFileRoute('/app/worklist/')({
    component: Index,
})