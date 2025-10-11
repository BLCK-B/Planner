import BaseHeader from "@/components/header/BaseHeader.tsx";
import ActionButtonsMainPage from "@/components/actions/ActionButtonsMainPage.tsx";

const HeaderMainPage = () => {

    const leftContent = (
        <ActionButtonsMainPage/>
    );

    return (
        <BaseHeader leftSide={leftContent} menu={true}/>
    );
};

export default HeaderMainPage;
