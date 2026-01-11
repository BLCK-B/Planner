import PlansList from "@/components/lists/PlansList.tsx";
import PageLayout from "@/components/base/PageLayout.tsx";
import TagCreator from "@/components/popover/CreatorMenu/TagCreator.tsx";
import BaseHeader from "@/components/header/BaseHeader.tsx";

const PlansPage = () => {
    return (
        <PageLayout
            header={<BaseHeader menu={true}/>}
            content={<PlansList/>}
            popover={<TagCreator/>}
        />
    );
};

export default PlansPage;