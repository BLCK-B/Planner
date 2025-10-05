import PlansGrid from "@/components/lists/PlansGrid.tsx";
import HeaderPlansPage from "@/components/header/HeaderPlansPage.tsx";
import PlanCreator from "@/components/popover/CreatorMenu/PlanCreator.tsx";
import PageLayout from "@/components/base/PageLayout.tsx";

const PlansPage = () => {
    return (
        <PageLayout
            header={<HeaderPlansPage/>}
            content={<PlansGrid/>}
            popover={<PlanCreator/>}
        />
    );
};

export default PlansPage;