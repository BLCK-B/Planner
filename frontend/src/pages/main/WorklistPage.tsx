import PageLayout from "@/components/base/PageLayout.tsx";
import BaseHeader from "@/components/header/BaseHeader.tsx";
import WorkList from "@/components/lists/WorkList.tsx";
import WorkItemCreator from "@/components/popover/CreatorMenu/WorkItemCreator.tsx";

const WorklistPage = () => {
    return (
        <PageLayout
            header={<BaseHeader menu={true}/>}
            content={<WorkList/>}
            popover={<WorkItemCreator/>}
        />
    );
};

export default WorklistPage;