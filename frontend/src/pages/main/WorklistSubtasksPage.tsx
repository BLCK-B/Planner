import PageLayout from "@/components/base/PageLayout.tsx";
import BaseHeader from "@/components/header/BaseHeader.tsx";
import SubtasksList from "@/components/lists/SubtasksList.tsx";
import WorkItemCreator from "@/components/popover/CreatorMenu/WorkItemCreator.tsx";

const WorklistSubtasksPage = () => {

    return (
        <PageLayout
            header={<BaseHeader menu={true}/>}
            content={<SubtasksList/>}
            popover={<WorkItemCreator/>}
        />
    );
};

export default WorklistSubtasksPage;