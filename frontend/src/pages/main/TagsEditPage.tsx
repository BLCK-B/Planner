import PageLayout from "@/components/base/PageLayout.tsx";
import TagsEditList from "@/components/lists/TagsEditList.tsx";
import TagCreator from "@/components/popover/CreatorMenu/TagCreator.tsx";
import BaseHeader from "@/components/header/BaseHeader.tsx";

const TagsEditPage = () => {
    return (
        <PageLayout
            header={<BaseHeader menu={true}/>}
            content={<TagsEditList/>}
            popover={<TagCreator/>}
        />
    );
};

export default TagsEditPage;