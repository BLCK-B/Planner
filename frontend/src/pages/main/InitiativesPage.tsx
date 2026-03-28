import PageLayout from "@/components/base/PageLayout.tsx";
import BaseHeader from "@/components/header/BaseHeader.tsx";
import InitiativesList from "@/components/lists/InitiativesList.tsx";
import InitiativeCreator from "@/components/popover/CreatorMenu/InitiativeCreator.tsx";

const InitiativesPage = () => {

    return (
        <PageLayout
            header={<BaseHeader/>}
            content={<InitiativesList/>}
            popover={<InitiativeCreator/>}
        />
    );
};

export default InitiativesPage;