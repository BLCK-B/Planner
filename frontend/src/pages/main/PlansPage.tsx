import PlansList from "@/components/lists/PlansList.tsx";
import HeaderPlansPage from "@/components/header/HeaderPlansPage.tsx";
import PageLayout from "@/components/base/PageLayout.tsx";
import TagCreator from "@/components/popover/CreatorMenu/TagCreator.tsx";

const PlansPage = () => {
    return (
        <PageLayout
            header={<HeaderPlansPage/>}
            content={<PlansList/>}
            popover={<TagCreator/>}
        />
    );
};

export default PlansPage;