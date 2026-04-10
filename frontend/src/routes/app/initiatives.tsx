import PageLayout from "@/components/base/PageLayout.tsx";
import BaseHeader from "@/components/header/BaseHeader.tsx";
import InitiativesList from "@/components/lists/InitiativesList.tsx";
import InitiativeCreator from "@/components/popover/creatorMenu/InitiativeCreator.tsx";
import {createFileRoute} from "@tanstack/react-router";
import {useSetAtom} from "jotai";
import {explainerModal} from "../../global/atoms";
import {MdInfo} from "react-icons/md";

const Initiatives = () => {

    const setShowExplainer = useSetAtom(explainerModal);

    const infoButton = <MdInfo style={{width: "1.5rem", height: "1.5rem", color: "grey"}} cursor="pointer"
                               onClick={() => setShowExplainer('initiativesExplainer')}/>

    return (
        <PageLayout
            header={<BaseHeader rightSide={infoButton}/>}
            content={<InitiativesList/>}
            popover={<InitiativeCreator/>}
        />
    );
};

export const Route = createFileRoute('/app/initiatives')({
    component: Initiatives,
})