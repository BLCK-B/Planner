import BaseHeader from "@/components/header/BaseHeader.tsx";
import ActionButtonsPlansPage from "@/components/actions/ActionButtonsPlansPage.tsx";

const HeaderPlansPage = () => {

    const leftContent = (
        <ActionButtonsPlansPage/>
    );

    return (
        <BaseHeader leftSide={leftContent} menu={true}/>
    );
};

export default HeaderPlansPage;