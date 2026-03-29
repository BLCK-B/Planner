import PageLayout from "@/components/base/PageLayout.tsx";
import TagsEditList from "@/components/lists/TagsEditList.tsx";
import TagCreator from "@/components/popover/creatorMenu/TagCreator.tsx";
import BaseHeader from "@/components/header/BaseHeader.tsx";
import {createFileRoute} from "@tanstack/react-router";

const TagsEdit = () => {
    return (
        <PageLayout
            header={<BaseHeader/>}
            content={<TagsEditList/>}
            popover={<TagCreator/>}
        />
    );
};

export const Route = createFileRoute('/app/tagsEdit')({
    component: TagsEdit,
})