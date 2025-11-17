import HeaderMainPage from "@/components/header/HeaderMainPage.tsx";
import PageLayout from "@/components/base/PageLayout.tsx";
import TagsEditList from "@/components/lists/TagsEditList.tsx";
import TagCreator from "@/components/popover/CreatorMenu/TagCreator.tsx";

const TagsEditPage = () => {
    return (
        <PageLayout
            header={<HeaderMainPage/>}
            content={<TagsEditList/>}
            popover={<TagCreator/>}
        />
    );
};

export default TagsEditPage;