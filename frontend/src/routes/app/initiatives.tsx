import PageLayout from "@/components/base/PageLayout.tsx";
import BaseHeader from "@/components/header/BaseHeader.tsx";
import InitiativesList from "@/components/lists/InitiativesList.tsx";
import InitiativeCreator from "@/components/popover/creatorMenu/InitiativeCreator.tsx";
import {createFileRoute} from "@tanstack/react-router";

const Initiatives = () => {

    return (
        <PageLayout
            header={<BaseHeader/>}
            content={<InitiativesList/>}
            popover={<InitiativeCreator/>}
        />
    );
};

export const Route = createFileRoute('/app/initiatives')({
    component: Initiatives,
})