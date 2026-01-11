import MainList from "@/components/lists/MainList.tsx";
import TaskCreator from "@/components/popover/CreatorMenu/TaskCreator.tsx";
import PageLayout from "@/components/base/PageLayout.tsx";
import BaseHeader from "@/components/header/BaseHeader.tsx";

const MainPage = () => {
    return (
        <PageLayout
            header={<BaseHeader menu={true}/>}
            content={<MainList/>}
            popover={<TaskCreator/>}
        />
    );
};

export default MainPage;