import PlansList from "@/components/lists/PlansList.tsx";
import HeaderPlansPage from "@/components/header/HeaderPlansPage.tsx";
import PlanCreator from "@/components/popover/CreatorMenu/PlanCreator.tsx";
import PageLayout from "@/components/base/PageLayout.tsx";

const PlansPage = () => {
    return (
        <PageLayout
            header={<HeaderPlansPage/>}
            content={<PlansList/>}
            popover={<PlanCreator/>}
        />
    );
};

export default PlansPage;