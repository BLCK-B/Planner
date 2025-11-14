import PageLayout from "@/components/base/PageLayout.tsx";
import TaskCreator from "@/components/popover/CreatorMenu/TaskCreator.tsx";
import HeaderTagsEditPage from "@/components/header/HeaderTasksEditPage.tsx";
import TagsEditList from "@/components/lists/TagsEditList.tsx";

const TagsEditPage = () => {
    return (
        <PageLayout
            header={<HeaderTagsEditPage/>}
            content={<TagsEditList/>}
            popover={<TaskCreator/>}
        />
    );
};

export default TagsEditPage;
