import MainList from "@/components/lists/MainList.tsx";
import TaskCreator from "@/components/popover/CreatorMenu/TaskCreator.tsx";
import HeaderMainPage from "@/components/header/HeaderMainPage.tsx";
import PageLayout from "@/components/base/PageLayout.tsx";

const MainPage = () => {
    return (
        <PageLayout
            header={<HeaderMainPage/>}
            content={<MainList/>}
            popover={<TaskCreator/>}
        />
    );
};

export default MainPage;